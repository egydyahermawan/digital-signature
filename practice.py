import math
import random
import time

#  DSA using RSA

def check_prime(number):
    for i in range(2, number):
        if number % i == 0:
            result = False
            break
        else:
            result = True
    return result

def generate_p(number):
    temp = number * 2
    candidate_p = None
    while(True):
        if temp % number == 0:
            candidate_p = temp + 1
            if check_prime(candidate_p):
                break
            else:
                temp = temp + number
        else:
            temp = temp + number   
    return candidate_p

def generate_g(p, q, h = 0):
    if(h == 0):
        h = random.randint(2, p - 1)
    
    pow = (p - 1) / q
    candidate_g = math.pow(h, pow) % p

    return int(candidate_g)

def generate_private_key(q = 0, x = 0):
    return random.randint(1, q - 1) if x == 0 else x

def generate_k(q = 0, k = 0):
    return random.randint(1, q - 1) if k == 0 else k

def generate_invers(k, q):
    try_number = 1
    while True:
        temp = ((q * try_number) + 1) / k
        if temp.is_integer():
            break
        else:
            try_number += 1
    return int(temp)

def generate_s(k_invers, hash_m, x, r, q):
    candidate_s = (k_invers * (hash_m + x * r)) % q
    return int(candidate_s)

# Defenisi Variabel
q = 7
p = generate_p(q)
g = generate_g(p, q, h=10)
x = generate_private_key(x=5)
y = int(math.pow(g, x) % p)

print('=' * 30)
print('Variabel & Pembangkitan Kunci')
print('=' * 30)
print('Nilai p = ', p)
print('Nilai q = ', q)
print('Nilai g = ', g)
print('Nilai x = ', x)
print('Nilai y = ', y)
print('=' * 30, '\n\n')


# Signing
hash_m = 4321
k = generate_k(k=4)
k_invers = generate_invers(k, q)
r = int((math.pow(g, k) % p) % q)
s = generate_s(k_invers, hash_m, x, r, q)

print('=' * 30)
print('Pembangkitan Tanda Tangan')
print('=' * 30)
print('Nilai H(m) = ', hash_m)
print('Nilai k = ', k)
print('Nilai k Invers = ', k_invers)
print('Nilai r = ', r)
print('Nilai s = ', s)
if(s == 0):
    print('Nilai s tidak boleh 0, ubah nilai k, k invers, dan r!')
    k = generate_k(q)
    k_invers = generate_invers(k, q)
    r = int((math.pow(g, k) % p) % q)
    s = generate_s(k_invers, hash_m, x, r, q)
    print('Hasil Generate nilai ulang')
    print('Nilai k = ', k)
    print('Nilai k Invers = ', k_invers)
    print('Nilai r = ', r)
    print('Nilai s = ', s)
print('=' * 30, '\n\n')


# Verify
s_invers = generate_invers(s, q)
w = s_invers % q
u1 = (hash_m * w) % q
u2 = (r * w) % q
v = int(((math.pow(g, u1) * math.pow(y, u2)) % p) % q)

print('=' * 30)
print('Verifikasi Tanda Tangan')
print('=' * 30)
print('Nilai s Invers = ', s_invers)
print('Nilai w = ', w)
print('Nilai u1 = ', u1)
print('Nilai u2 = ', u2)
print('Nilai v = ', v)
print('=' * 30)
if r == v:
    print('Tanda Tangan Sah!')
else:
    print('Tanda Tidak Tangan Sah!')
print('=' * 30)