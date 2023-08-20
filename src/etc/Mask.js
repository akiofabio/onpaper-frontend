export　function cpfMask(cpfNumero) {
    if(cpfNumero){
        cpfNumero = cpfNumero.replace(/\D/g, "");
        if(cpfNumero.length >11){
            cpfNumero = cpfNumero.slice(0, 11);
        }
        if(cpfNumero.length > 8)
            cpfNumero = cpfNumero.replace(/(\d{1,3})(\d{3})(\d{3})(\d\d)/, "$1.$2.$3-$4");
        else if(cpfNumero.length > 5)
            cpfNumero = cpfNumero.replace(/(\d{1,3})(\d{3})(\d\d)/, "$1.$2-$3");
        else if(cpfNumero.length > 2)
            cpfNumero = cpfNumero.replace(/(\d{1,3})(\d\d)/, "$1-$2");
        return cpfNumero
    }
}



export　function cepMask(cepNumero) {
    if(Number.isInteger(cepNumero)){
        cepNumero = cepNumero.toString()
    }
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
        valorMask = "R$ 0,00" 
        return valorMask
    }
}

export　function stringDataMask(data) {

    
    if(data){
        if(Object.prototype.toString.call(data) === '[object Date]'){
            data = data.getDate()
        }
        if(data.search("T"))
            data = data.split('T')[0]
        data = data.replace(/\D/g, "");
        data = data.replace(/(\d\d\d\d)(\d\d)(\d\d)/, "$3/$2/$1");
        return data
    }
}

export　function dataToInputDataMask(data) {
    if(data){
        if(data.search("T"))
            data = data.split('T')[0]
        return data
    }
}
