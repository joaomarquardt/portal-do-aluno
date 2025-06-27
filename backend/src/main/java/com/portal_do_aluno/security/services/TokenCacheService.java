package com.portal_do_aluno.security.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class TokenCacheService {

    private final RedisTemplate<String, String> redisTemplate;

    @Autowired
    public TokenCacheService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void cacheToken(String token, long expirationInSeconds) {
        redisTemplate.opsForValue().set(token, "VALID", Duration.ofSeconds(expirationInSeconds));
    }

    public boolean isTokenValid(String token) {
        return "VALID".equals(redisTemplate.opsForValue().get(token));
    }

    public void invalidateToken(String token) {
        redisTemplate.delete(token);
    }
}