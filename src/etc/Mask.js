
export　function cepMask(cepNumero) {
    if(cepNumero){
        cepNumero = cepNumero.replace(/\D/g, "");
        if(cepNumero.length >8){
            cepNumero = cepNumero.slice(0, 8);
        }
        if(cepNumero.length >4)
            cepNumero = cepNumero.replace(/(\d{1,5})(\d\d\d)/, "$1-$2");
        return cepNumero
    }
}

export　function moedaRealMask(valor) {
    
    if(valor){
        
        var valorMask
        if(valor<0){
            valorMask = "- "
        }
        valorMask = "R$ " + Number(valor).toFixed(2)
        valorMask = valorMask.replace(/\./, ',')
        return valorMask
    }
    else{
        return valor
    }
}


