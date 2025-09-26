package com.aura.voiceback.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class CallSession {
    @Id
    private String sessionId;
    private String userA;
    private String userB;

    // getters & setters
    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
    public String getUserA() { return userA; }
    public void setUserA(String userA) { this.userA = userA; }
    public String getUserB() { return userB; }
    public void setUserB(String userB) { this.userB = userB; }
}
