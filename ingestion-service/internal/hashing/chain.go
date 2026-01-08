package hashing

import (
	"crypto/sha256"
	"encoding/hex"
)

func ComputeHash(payload []byte, previousHash string) string {
	h := sha256.New()
	h.Write(payload)
	h.Write([]byte(previousHash))
	return hex.EncodeToString(h.Sum(nil))
}