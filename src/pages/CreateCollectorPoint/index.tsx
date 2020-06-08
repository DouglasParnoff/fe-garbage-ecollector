import React, { useEffect, useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker} from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import api from "../../services/api"
import axios from "axios";

import "./styles.css";
import logo from "../../assets/logo.svg";

interface ItemType{
    id: string,
    title: string,
    imageURL: string
}

interface IbgeUFResponse {
    sigla: string;
}

interface IbgeCityResponse {
    nome: string;
}

const CreateCollectorPoint = () => {

    const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);    
    const [cities, setCities] = useState<string[]>([]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0]);

    const [selectedUf, setSelectedUf] = useState("0");
    const [selectedCity, setSelectedCity] = useState("0");
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0]);
    const [selectedItemTypes, setSelectedItemTypes] = useState<number[]>([]);
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        whatsapp: ""        
    });

    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords;
            setInitialPosition([latitude, longitude]);
        });
    },[]);

    useEffect(() => {
        api.get("/itemTypes").then( response => {
            setItemTypes(response.data);
        });
    },[]);

    useEffect(() => {
        axios.get<IbgeUFResponse[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
            .then( response => {
                const ufInitials = response.data.map(uf => uf.sigla);
                setUfs(ufInitials);
            });
    },[]);

    useEffect(() => {
        if(selectedUf === "0"){
            return
        }

        axios.get<IbgeCityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then( response => {
                const citiesNames = response.data.map(city => city.nome);
                setCities(citiesNames);
            });

    },[selectedUf]);

    function handleSelectedItemTypes(id: number){
        const alreadySelected = selectedItemTypes.findIndex(itemType => itemType === id);
        let newSelectedItemTypes;
        if(alreadySelected >= 0){
            newSelectedItemTypes = selectedItemTypes.filter(item => item !== id);
        } else {
            newSelectedItemTypes = [...selectedItemTypes, id];
        }
        setSelectedItemTypes(newSelectedItemTypes);
    }

    function handleInputChange(event : ChangeEvent<HTMLInputElement>){
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});
    }

    function handleMapClick(event : LeafletMouseEvent){
        setSelectedPosition([
            event.latlng.lat, event.latlng.lng
        ]);
    }

    function handleSelectUf(event : ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value;
        setSelectedUf(uf);
    }

    function handleSelectCity(event : ChangeEvent<HTMLSelectElement>){
        const city = event.target.value;
        setSelectedCity(city);
    }

    return (
        <div id="page-create-collector-point">
            <header>
                <img src={logo} alt="ECollectorPoint"/>
                <Link to="/">
                    <FiArrowLeft/> Voltar para home
                </Link>
            </header>
            <form>
                <h1>Cadastro do <br /> ponto de coleta</h1> 
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="text"
                                name="email"
                                id="email"
                                onChange={handleInputChange}                                
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={handleInputChange}                                
                            />
                        </div>                                               
                    </div>                    

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={[-30.140719, -51.130112]} zoom={13} onClick={handleMapClick}>
                        <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                        />
                        <Marker position={selectedPosition}>
                        </Marker>
                    </Map>                    

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                                <option value="0">Selecione uma UF</option>
                                {
                                    ufs.map(uf => (
                                        <option key={uf} value={uf}>{uf}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                                <option value="0">Selecione uma Cidade</option>
                                {
                                    cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))
                                }                                
                            </select>
                        </div>                        
                    </div>

                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de Coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {itemTypes.map(item => (
                            <li 
                                key={item.id} 
                                onClick={() => handleSelectedItemTypes(Number(item.id))}
                                className={selectedItemTypes.includes(Number(item.id)) ? "selected" : ""}>
                                <img src={item.imageURL} alt="Teste"/>
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>

                </fieldset>
                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
            </form>
        </div>
    );
}

export default CreateCollectorPoint;