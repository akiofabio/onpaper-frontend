export　function numeroCartaoMask(numero) {
    if(numero){
        if(Number.isInteger(numero) ){
            numero = numero.toString()
        }
        numero = numero.replace(/\D/g, "");
        if(numero.length > 16){
            numero = numero.slice(0, 16);
        }
        if(numero.length > 12)
            numero = numero.replace(/(\d{1,4})(\d{4})(\d{4})(\d{4})/, "$1.$2.$3.$4");
        else if(numero.length > 8)
            numero = numero.replace(/(\d{1,4})(\d{4})(\d{4})/, "$1.$2.$3");
        else if(numero.length > 4)
            numero = numero.replace(/(\d{1,4})(\d{4})/, "$1.$2");
        return numero
    }
}

export　function cpfMask(numero) {
    if(numero){
        if(Number.isInteger(numero) ){
            numero = numero.toString()
        }
        numero = numero.replace(/\D/g, "");
        if(numero.length > 12){
            numero = numero.slice(0, 16);
        }
        if(numero.length > 8)
            numero = numero.replace(/(\d{1,3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        else if(numero.length > 5)
            numero = numero.replace(/(\d{1,3})(\d{3})(\d{2})/, "$1.$2-$3");
        else if(numero.length > 2)
            numero = numero.replace(/(\d{1,3})(\d{2})/, "$1-$2");
        return numero
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
        var valorMask =""
        if(valor<0){
            valorMask = "- "
        }
        valorMask = valorMask + "R$ " + Number(valor).toFixed(2)
        valorMask = valorMask.replace(/\./, ',')
        return valorMask
    }
    else{
        valorMask = "R$ 0,00" 
        return valorMask
    }
}

export　function moedaRealToFloatMask(valor) {
    if(valor){
        var valorMask = valor
        valorMask = valorMask.replace(/\D/g, "");
        valorMask = parseInt(valorMask)
        return valorMask/100
    }
    else{
        return 0
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

export　function dataToStringDataHoraMask(data) {
    if(data){
        if(data instanceof Date){
            data = data.toDateString()
        }
        if(data.search("T")){
            var dataHora = data.split('T')[1]
            dataHora = dataHora.split('.')[0]

            data = data.split('T')[0]
            data = data.replace(/\D/g, "");
            data = data.replace(/(\d\d\d\d)(\d\d)(\d\d)/, "$3/$2/$1");
            data += " as " + dataHora
        }
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

export　function dataToInputMesEAnoDataMask(data) {
    if(data){
        if(data instanceof Date){
            data = data.toDateString()
        }
        if(data.search("T")){
            data = data.split('T')[0]
        }
        if(data.search("-")){
            data = data.split('-')[0]+ "-" + data.split('-')[1]
        }
        return data
    }
}

export　function dataToStringMesEAnoDataMask(data) {
    if(data){
        if(data instanceof Date){
            data = data.toDateString()
        }
        if(data.search("T")){
            data = data.split('T')[0]
        }
        if(data.search("-")){
            data = data.split('-')[1]+ "/" + data.split('-')[0]
        }
        return data
    }
}

