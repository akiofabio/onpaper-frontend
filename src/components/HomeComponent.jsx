import React, { useEffect , useState } from 'react';
import { useNavigate , useParams} from 'react-router-dom';
import CarrinhoService from '../services/CarrinhoService';
import ProdutoService from '../services/ProdutoService';
import ClienteService from '../services/ClienteService';
import AutoCreateComponent from './AutoCreateComponent';
import GraficoComponent from './GraficoComponent';


function HomeComponent() {
    const [produtos, setProdutos] = useState([]);
    const navigate = useNavigate();
   
    async function addItem( produtoId ){
        var carrinho;
        if( !localStorage.getItem( "isLogged" ) ) {
            if( !localStorage.getItem( "carrinhoId" ) ) {
                console.log("Não possue carrinho") 
                
                const carrinhoNovo = { 
                    itens : [], 
                    endereco : null
                }
                carrinho = await CarrinhoService.createCarrinho( carrinhoNovo ).then( res => {
                    return res.data
                });
                localStorage.setItem( "carrinhoId" , carrinho.id )
            }
            else {
                console.log("Possue carrinho") 
                carrinho = await CarrinhoService.getCarrinhoById( localStorage.getItem( "carrinhoId" ) ).then( res => {
                    return res.data
                })
            }
        } 
        else{
            if( localStorage.getItem( "tipo" ) === "CLIENTE" )
            var cliente = await ClienteService.getClienteById( localStorage.getItem( "id" ) ).then( res => {
                return res.data
            })
            carrinho = cliente.carrinho
            console.log("cliente.carrinho" + JSON.stringify(cliente.carrinho))
        }        
        var porduto = await ProdutoService.getProdutoById( produtoId ).then( res => {
            return res.data
        })
        var item =  {
            produto : porduto, 
            quantidade : 1,
            preco : porduto.preco,
        }        
                
        await CarrinhoService.addItemCarrinho( item , localStorage.getItem( "carrinhoId" ) )
        navigate( "/carrinho" )
    }

    useEffect(() => {
        //localStorage.clear()
        ProdutoService.getProdutos().then((res) => {
            setProdutos(res.data);
        })
    }, []);
        
    const handleErro = (e) => {
        
    }
    return (
        <div>
            <h1>Onpaper, a melhor papelaria online de LES deste 2022</h1>
            <AutoCreateComponent/>
            <GraficoComponent/>
            
            <div style={{marginTop:100}}>
                <h3>Destaques:</h3>
                <div className='row row-cols-4'>
                    {produtos.map(
                        produto => 
                        <div key = {produto.id} style={{ border: "1px black solid" }} className="col text-center">
                            <div className='card-body'>
                            <div>
                                <img src={'imagens/produtos/' + produto.imagens} alt="Imagem do Produto" width='200' height="auto"></img>
                            </div>
                            <p>Nome: {produto.nome}</p>
                            <p>Descrição: {produto.descricao}</p>
                            <button type="button" className='btn btn-dark' onClick={()=>addItem(produto.id)}>Adicionar ao Carrinho</button>
                        </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default HomeComponent;