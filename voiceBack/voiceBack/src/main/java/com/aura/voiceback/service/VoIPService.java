package com.aura.voiceback.service;

import org.springframework.stereotype.Service;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class VoIPService {

    // 세션ID -> WebSocketSession
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    private byte[] convertPCMToWAV(byte[] pcmBytes, int sampleRate, int channels) {
        int byteRate = sampleRate * channels * 2; // 16bit
        int dataSize = pcmBytes.length;
        int totalSize = 44 + dataSize;

        byte[] wav = new byte[totalSize];

        // RIFF 헤더
        wav[0] = 'R';
        wav[1] = 'I';
        wav[2] = 'F';
        wav[3] = 'F';
        int chunkSize = totalSize - 8;
        wav[4] = (byte) (chunkSize & 0xff);
        wav[5] = (byte) ((chunkSize >> 8) & 0xff);
        wav[6] = (byte) ((chunkSize >> 16) & 0xff);
        wav[7] = (byte) ((chunkSize >> 24) & 0xff);

        wav[8] = 'W';
        wav[9] = 'A';
        wav[10] = 'V';
        wav[11] = 'E';

        // fmt subchunk
        wav[12] = 'f';
        wav[13] = 'm';
        wav[14] = 't';
        wav[15] = ' ';
        wav[16] = 16; // PCM subchunk size
        wav[17] = 0;
        wav[18] = 0;
        wav[19] = 0;
        wav[20] = 1; // audio format PCM
        wav[21] = 0;
        wav[22] = (byte) channels;
        wav[23] = 0;
        wav[24] = (byte) (sampleRate & 0xff);
        wav[25] = (byte) ((sampleRate >> 8) & 0xff);
        wav[26] = (byte) ((sampleRate >> 16) & 0xff);
        wav[27] = (byte) ((sampleRate >> 24) & 0xff);
        int byteRateLE = byteRate;
        wav[28] = (byte) (byteRateLE & 0xff);
        wav[29] = (byte) ((byteRateLE >> 8) & 0xff);
        wav[30] = (byte) ((byteRateLE >> 16) & 0xff);
        wav[31] = (byte) ((byteRateLE >> 24) & 0xff);
        short blockAlign = (short) (channels * 2);
        wav[32] = (byte) (blockAlign & 0xff);
        wav[33] = (byte) ((blockAlign >> 8) & 0xff);
        short bitsPerSample = 16;
        wav[34] = (byte) (bitsPerSample & 0xff);
        wav[35] = (byte) ((bitsPerSample >> 8) & 0xff);

        // data subchunk
        wav[36] = 'd';
        wav[37] = 'a';
        wav[38] = 't';
        wav[39] = 'a';
        wav[40] = (byte) (dataSize & 0xff);
        wav[41] = (byte) ((dataSize >> 8) & 0xff);
        wav[42] = (byte) ((dataSize >> 16) & 0xff);
        wav[43] = (byte) ((dataSize >> 24) & 0xff);

        // PCM 데이터 복사
        System.arraycopy(pcmBytes, 0, wav, 44, pcmBytes.length);

        return wav;
    }


    public void registerSession(String sessionId, WebSocketSession session) {
        sessions.put(sessionId, session);
    }

    public void removeSession(String sessionId) {
        sessions.remove(sessionId);
    }

    // 1:1 중계
    public void forwardAudio(String senderId, byte[] audioBytes) {
        // 예: 48000Hz, mono
        byte[] wavBytes = convertPCMToWAV(audioBytes, 48000, 1);

        sessions.values().forEach(s -> {
            try {
                if (s.isOpen() && !s.getId().equals(senderId)) {
                    s.sendMessage(new BinaryMessage(wavBytes));
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }
}