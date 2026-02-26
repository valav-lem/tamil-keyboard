# Tasks - Secure Storage (Kaaval)

## Research Summary

### 1. Python Keyring Libraries

**Recommendation: `keyring`**

| Feature | keyring | keytar |
|---------|---------|--------|
| Native backends | ✅ freedesktop, Windows, macOS | ✅ Same |
| No compilation | ✅ Pure Python | ❌ Requires libsecret |
| Maintenance | ✅ Active (psf) | ⚠️ Less active |
| Install size | ✅ Smaller | ❌ Larger (native deps) |

**Example using `keyring`:**
```python
import keyring

# Store a secret
keyring.set_password("yazhi-auth", "user@example.com", "my_secret_token")

# Retrieve a secret
secret = keyring.get_password("yazhi-auth", "user@example.com")
# Returns: "my_secret_token"

# Delete a secret
keyring.delete_password("yazhi-auth", "user@example.com")
```

### 2. SQLite Encryption Options

#### Option A: SQLCipher (Full Database Encryption)
- **Pros:** Transparent full-db encryption, SQLite-compatible
- **Cons:** Requires pysqlcipher3, more complex setup
```python
# Requires: pip install pysqlcipher3
import pysqlcipher3

conn = pysqlcipher3.connect("secrets.db")
conn.set_passphrase("your_encryption_key")
# SQLite operations work normally
```

#### Option B: cryptography library (Column/Value Encryption)
- **Pros:** Simple, no native deps, flexible
- **Cons:** Encrypts values only, not entire DB
- **Best for:** Specific sensitive fields (tokens, passwords)

```python
from cryptography.fernet import Fernet

key = Fernet.generate_key()
f = Fernet(key)

# Encrypt a value
ciphertext = f.encrypt(b"sensitive_data")

# Decrypt
plaintext = f.decrypt(ciphertext)
```

**Recommendation:** Use `cryptography` library for value-level encryption (simpler, already in requirements.txt). Use SQLCipher if full database encryption is required.

### 3. Encryption Utility Created

**File:** `yazhi_auth/encryption.py`

```python
from yazhi_auth.encryption import encrypt, decrypt, generate_key

# Generate a key
key = generate_key()

# Encrypt
ciphertext = encrypt("my_secret", key)

# Decrypt
plaintext = decrypt(ciphertext, key)
```

## Dependencies
- `cryptography>=41.0.0` (already in requirements.txt)

## Status: ✅ Complete
