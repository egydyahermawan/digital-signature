let Q = null, P = null, H = null, G = null, X = null, Y = null
let HashM = null, K = null, KInvers = null, R = null, S = null
let SInvers = null, W = null, U1 = null, U2 = null, V = null


// Logic

function check_prime(number){
    let result = false
    for(let i = 2; i < number; i++){
        if(number % i == 0){
            result = false
            break
        } else{
            result = true
        }
    }

    return result
}

function generate_p(number){
    let temp = number * 2
    let candidateP = null

    while(true){
        if (temp % number == 0){
            candidateP = temp + 1
            if (check_prime(candidateP)){
                break
            } else{
                temp = temp + number
            }
        }else{
            temp = temp + number   
        }
    }

    return candidateP
}

function generate_g(p, q, h = 0){
    if(h == 0){
        h = Math.floor(Math.random() * ((p - 1) - 2 + 1) + 2)
        H = h
    }
    
    let pow = (p - 1) / q
    candidateG = Math.pow(h, pow) % p

    return parseInt(candidateG)
}

function generate_private_key(x){
    return x == 0 ? Math.floor(Math.random() * ((Q - 1) - 1 + 1) + 1) : x
}

function generate_k(k = 0){
    return k == 0 ? Math.floor(Math.random() * ((Q - 1) - 1 + 1) + 1) : k
}

function generate_invers(number){
    let try_number = 1
    let temp = null
    while(true){
        temp = ((Q * try_number) + 1) / number
        if(Number.isInteger(temp)){
            break
        }else{
            try_number += 1
        }
    }

    return parseInt(temp)
}

// Button Action

function prosesQ() {
    Q = $('#var-q').val()

    if(Q == ''){
        return alert('Isi nilai Q!')
    }

    P = generate_p(parseInt(Q))
    
    $('#variables-list').append(`
        <li class="list-group-item">P = ${P}</li>
        <li class="list-group-item">Q = ${Q}</li>
    `)

    $('#hasil-input').toggleClass('d-none')
    $('#proses-q').toggleClass('d-none')
    $('#proses-h').toggleClass('d-none')
}

function prosesH(){
    H = $('#var-h').val()
    H = H == '' ? 0 : H
    G = generate_g(P, Q, H)

    $('#variables-list').append(`
        <li class="list-group-item">H = ${H}</li>
        <li class="list-group-item">
            G = H<sup>(P - 1) / Q</sup> mod P <br>
            G = ${H}<sup>(${P} - 1) / ${Q}</sup> mod ${P} <br> 
            G = ${G} 
        </li>
    `)

    $('#proses-h').toggleClass('d-none')
    $('#proses-x').toggleClass('d-none')
}

function prosesX(){
    X = $('#var-x').val()
    X = X == '' ? generate_private_key(0) : generate_private_key(X)
    Y = parseInt(Math.pow(G, X) % P)
    
    $('#variables-list').append(`
        <li class="list-group-item">X = ${X}</li>
        <li class="list-group-item">
            Y = G<sup>X</sup> mod P <br>
            Y = ${G}<sup>${X}</sup> mod ${P} <br> 
            Y = ${Y}
        </li>
    `)

    $('#proses-x').toggleClass('d-none')
    $('#proses-input').toggleClass('d-none')
    $('#signing').toggleClass('d-none')
}

function prosesHM(){
    HashM = $('#var-h-m').val()

    if(HashM == ''){
        return alert('Mohon isi H(M)!')
    }

    HashM = parseInt(HashM)

    $('#signing-variables-list').append(`<li class="list-group-item">H(M) = ${HashM}</li>`)
    $('#signing-hasil-input').toggleClass('d-none')
    $('#proses-h-m').toggleClass('d-none')
    $('#proses-k').toggleClass('d-none')
}

function prosesK(){
    K = $('#var-k').val() == '' ? generate_k(0) : parseInt($('#var-k').val())
    KInvers = generate_invers(K)
    R = parseInt((Math.pow(G, K) % P) % Q)
    S = (KInvers * (HashM + (X * R))) % Q

    $('#signing-variables-list').append(`
        <li class="list-group-item">K = ${K}</li>
        <li class="list-group-item">K<sup>-1</sup> = ${KInvers}</li>
        <li class="list-group-item">
            R = (G<sup>K</sup> mod P) mod Q <br>
            R = (${G}<sup>${K}</sup> mod ${P}) mod ${Q} <br>
            R = ${R}
        </li>
        <li class="list-group-item">
            S = (K<sup>-1</sup> (H(M) + X * R)) mod Q <br>
            S = (${K}<sup>-1</sup> (${HashM} + ${X} * ${R})) mod ${Q} <br>
            S = ${S}
        </li>
    `)

    prosesR()
}

function prosesR(){
    $('#signing-proses-input').toggleClass('d-none')
    $('#verify').toggleClass('d-none')

    SInvers = generate_invers(S)
    W = SInvers % Q
    U1 = (HashM * W) % Q
    U2 = (R * W) % Q
    V = parseInt(((Math.pow(G, U1) * Math.pow(Y, U2)) % P) % Q)

    $('#verify-variables-list').append(`
        <li class="list-group-item">S<sup>-1</sup> = ${SInvers}</li>
        <li class="list-group-item">
            W = S<sup>-1</sup> mod Q <br>
            W = ${SInvers} mod ${Q} <br>
            W = ${W}
        </li>
        <li class="list-group-item">
            U1 = (H(M) * W) mod Q <br>
            U1 = (${HashM} * ${W}) mod ${Q} <br>
            U1 = ${U1}
        </li>
        <li class="list-group-item">
            U2 = (R * W) mod Q <br>
            U2 = (${R} * ${W}) mod ${Q} <br>
            U2 = ${U2}
        </li>
        <li class="list-group-item">
            V = ((G<sup>U1</sup> * Y<sup>U2</sup>) mod P) mod Q) <br>
            V = ((${G}<sup>${U1}</sup> * ${Y}<sup>${U2}</sup>) mod ${P}) mod ${Q}) <br>
            V = ${V}
        </li>
    `)

    $('#verify-hasil-box').append(`
        <div class="row row-cols-1 row-cols-md-3 justify-content-center mb-3">
            <div class="col">
                <ul class="list-group text-center">
                    <li class="list-group-item">Nilai R</li>
                    <li class="list-group-item">${R}</li>
                </ul>
            </div>
            <div class="col d-flex align-items-center justify-content-center">
                VS
            </div>
            <div class="col">
                <ul class="list-group text-center">
                    <li class="list-group-item">Nilai V</li>
                    <li class="list-group-item">${V}</li>
                </ul>
            </div>
        </div>
        <div class="alert alert-${R == V ? 'success' : 'danger'} mb-0" role="alert">
            ${R == V ? 'Tanda Tangan Sah! Nilai R dan V sama!' : 'Oops... Tanda Tangan Tidak Sah! Nilai R dan V berbeda!'}
        </div>
    `)
}
