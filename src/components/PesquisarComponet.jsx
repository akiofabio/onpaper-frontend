import React, { useEffect , useState , useRef } from 'react';
import { moedaRealMask } from '../etc/Mask'
import CategoriaService from '../services/CategoriaService';
import FabricanteService from '../services/FabricanteService';
import ProdutoService from '../services/ProdutoService';
import { useNavigate , useParams} from 'react-router-dom';
function PesquisarComponent() {
    const [ produtos,setProdutos ] = useState([])
    const [ categorias , setCategorias ] = useState([])
    const [ fabricantes , setFabricantes] = useState([])
    const [ categoriasFiltro , setCategoriasFiltro ] = useState([])
    const [ fabricantesFiltro , setFabricantesFiltro] = useState([])
    const { pesquisa } = useParams()
    const navigate = useNavigate();
    function selecionarCatergorias(categoria){
        var temp = categoriasFiltro
        if(temp.indexOf(categoria)!==-1){
            temp = temp.filter(cat => temp.indexOf(cat) !== temp.indexOf(categoria))
        }
        else{
            temp.push(categoria)
        }
        setCategoriasFiltro(temp)
    }
    
    function aplicarFiltro(){
        ProdutoService.getProdutoByNome(pesquisa,categoriasFiltro,fabricantesFiltro).then(res => {
            alert(JSON.stringify(res.data))
            setProdutos(res.data)
        }).catch(error => {
            alert(JSON.stringify(error.response.data))
        })
    }

    useEffect(() => {
        if(categorias.length===0){
            CategoriaService.getCategorias().then(res => {
                setCategorias(res.data)
            }).catch(error => {
                alert(error.response.data)
            })
        }
        if(fabricantes.length===0){
            FabricanteService.getFabricantes().then(res => {
                setFabricantes(res.data)
            }).catch(error => {
                alert(error.response.data)
            })
        }
        if(produtos.length===0){
            ProdutoService.getProdutoByNome(pesquisa,categoriasFiltro,fabricantesFiltro).then(res => {
                setProdutos(res.data)
                alert(JSON.stringify(res.data))
            }).catch(error => {
                alert("produto erro")
                alert(JSON.stringify(error.response.data))
            })
        }
    }, [])
    return(
        <div className='row'>
            <div className='col-2' >
                <div className='card border-dark'  style={{ marginTop:5}}>
                    <div className='card-header bg-dark text-white'>
                        <h2>Filtros</h2>
                    </div>
                    <div className='card-body'>
                        <h3>Categorias:</h3>
                        {categorias.map(categoria =>
                        <div>
                            <input type={"checkbox"} onClick={() => selecionarCatergorias(categoria)}></input> {categoria.nome}
                        </div>
                        )}
                        <h3>Fabricante:</h3>
                        {fabricantes.map(fabricante =>
                        <div>
                            <input type={"checkbox"}></input> {fabricante.nome}
                        </div>
                        )}
                    </div>
                    <button onClick={() => aplicarFiltro()}>Aplicar Filtro</button>
                </div>
            </div>
            <div className='col'>
                <h3>Pesquisar: {pesquisa}</h3>
                {produtos.map(produto =>
                    <button onClick={()=>navigate("/produto/"+ produto.id)}>
                        <div key = {produto.id} className='card '>
                            <div className="container" style={{margin: 0,padding :0}}>
                                <div className='card-body'>
                                    <div className='row no-gutters'>
                                        <div className='col-sm-3' style={{textAlign:'center', width:180, height:180}}>
                                            <img src={'/imagens/produtos/' + produto.imagens} alt={produto.imagens} className="img-fluid" style={{maxHeight:"100%",maxWidth:"100%"}} ></img>
                                        </div>
                                        <div className='col-sm-8'>
                                            <div className='row'>
                                                <p style={{ fontSize:18 , fontWeight:"bold"}}>{produto.nome}</p>
                                            </div>
                                            <div className='row' >
                                                {produto.categorias.map(categoria => 
                                                    <div className='col-auto'>
                                                        <button>{categoria.nome}</button>
                                                    </div>
                                                )}
                                            </div>
                                            <div className='row'>
                                                <p style={{ marginBottom:0}}>Por</p>
                                                <p>{moedaRealMask(produto.preco)}</p>
                                            </div>
                                        </div>    
                                    </div>
                                </div>
                            </div>
                        </div>
                    </button>
                )}
            </div>
        </div>
    )
}
export default PesquisarComponent