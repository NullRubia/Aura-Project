package com.aura.voiceback.dto;

public class AudioChunkDto {
    private String type; // "audio", "stt", "meta" 등
    private String from; // 송신자
    private String to;   // 수신자
    private String chunk; // Base64 또는 바이너리 데이터

    public AudioChunkDto() {}

    public AudioChunkDto(String type, String from, String to, String chunk) {
        this.type = type;
        this.from = from;
        this.to = to;
        this.chunk = chunk;
    }

    // getters & setters
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getFrom() { return from; }
    public void setFrom(String from) { this.from = from; }
    public String getTo() { return to; }
    public void setTo(String to) { this.to = to; }
    public String getChunk() { return chunk; }
    public void setChunk(String chunk) { this.chunk = chunk; }
}
