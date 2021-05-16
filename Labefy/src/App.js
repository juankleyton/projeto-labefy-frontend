import React from 'react';
import Axios from 'axios';
import styled from 'styled-components';

const AppContainer = styled.div `
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
`

const CriaPlaylist = styled.div `
  padding: 20px;
`

let PlaylistID = "";

class App extends React.Component {

  state = {
    playlists: [],
    novaPlaylist: "",
    
    listaMusicas: [],
    addMusica: "",
    addCantorOuBanda: "",
    urlMusica: "",

    name: "",
    artist: "",
    url: ""
  }

  componentDidMount = () => {
    this.mostraPlaylists()
  }

  onChangeNovaPlaylist = event => {
    this.setState({novaPlaylist: event.target.value})
  }

  onChangeAddMusica = event => {
    this.setState({addMusica: event.target.value})
  }

  onChangeCantorOuBanda = event => {
    this.setState({addCantorOuBanda: event.target.value})
  }

  onChangeUrlMusica = event => {
    this.setState({urlMusica: event.target.value})
  }

  criaPlaylist = () => {
    const body = {
      name: this.state.novaPlaylist
    }
    Axios.post("https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists",body,
      {
        headers: {
          Authorization: "juan-albuquerque-jackson"
        }
      }
    ).then(() => {
      this.mostraPlaylists()
      this.setState({novaPlaylist: ""})
    }).catch((err) => {
      alert(err)
    })
  }

  mostraPlaylists = () => {
    Axios.get("https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists",
    {
      headers: {
        Authorization: "juan-albuquerque-jackson"
      }
    }) 
    .then(response => {
      this.setState({playlists: response.data.result.list})
    })
    .catch(err => {
      alert(err)
    })
  }

  confirmExcluirPlaylist = PlaylistID => {
    const exclusao = window.confirm("Deseja excluir a Playlist?")
    if (exclusao) {
      this.deletaPlaylist(PlaylistID)
    }
  }

  deletaPlaylist = PlaylistID => {
    Axios.delete(`https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists/${PlaylistID}`,
      {
        headers: {
          Authorization: "juan-albuquerque-jackson"
        }
      }
    ).then(() => {
      this.mostraPlaylists()
    }).catch(err => {
      alert(err)
    })
  }

  mostraMusicasPlaylist = () => {
    Axios.get(`https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists/${PlaylistID}/tracks`,
    {
      headers: {
        Authorization: "juan-albuquerque-jackson"
      }
    }) 
    .then(response => {
      this.setState({listaMusicas: response.data.result.tracks})
    })
    .catch(err => {
      alert(err)
    })
  }

  playlistEscolhida = (event) => {
    const nomePlaylist = event.target.value
    const playlistFiltrada =  this.state.playlists.filter((item) => item.name === nomePlaylist)
    PlaylistID = playlistFiltrada.map(element => element.id).toString()

    this.mostraMusicasPlaylist()
  }
  
  addMusicaPlaylist = () => {
    const body = {
      name: this.state.addMusica,
      artist: this.state.addCantorOuBanda,
      url: this.state.urlMusica
    }
    Axios.post(`https://us-central1-labenu-apis.cloudfunctions.net/labefy/playlists/${PlaylistID}/tracks`,body,
      {
        headers: {
          Authorization: "juan-albuquerque-jackson"
        }
      }
    ).then(() => {
      this.mostraMusicasPlaylist()
      this.setState({addMusica: "", addCantorOuBanda: "", urlMusica: ""})
    }).catch((err) => {
      alert(err)
    })
  }

  render() {
  
    return (
      <AppContainer>

        <CriaPlaylist>
          <h1>Labefy</h1>
          <label><strong>Nova Playlist: </strong></label>
          <input
            value={this.state.novaPlaylist}
            onChange={this.onChangeNovaPlaylist}
          />
          <button onClick={this.criaPlaylist}>Criar Playlist</button>    
          <h4>Playlists já cadastradas:</h4>
          {this.state.playlists.map(playlist => {
            return (
              <div key={playlist.id}>
                <li>{playlist.name} - <button onClick={() => this.confirmExcluirPlaylist(playlist.id)}>Excluir</button></li>
                <hr />
              </div>
            )
          })}
        </CriaPlaylist>

        <div>
          <label><strong>Escolha uma Playlist para adicionar músicas: </strong></label>
          <select onChange={this.playlistEscolhida}>
            <option value=""></option>
            {this.state.playlists.map(playlist => {
              return <option key={playlist.id} value={playlist.name}>{playlist.name}</option>
            })}
          </select>
          <input
            value={this.state.addMusica}
            onChange={this.onChangeAddMusica}
            placeholder={"Insira nome da Música"}
          />
          <input
            value={this.state.addCantorOuBanda}
            onChange={this.onChangeCantorOuBanda}
            placeholder={"Insira nome do Cantor/Banda"}
          />
          <input
            value={this.state.urlMusica}
            onChange={this.onChangeUrlMusica}
            placeholder={"Insira URL da Música"}
          />
          <button onClick={this.addMusicaPlaylist}>Adicionar Música</button>
        </div>

        <div>
        <h4>Músicas já cadastradas:</h4>
        {this.state.listaMusicas.map(lista => {
          return <div key={lista.id}>
                    <li><strong>{lista.name} - {lista.artist}</strong></li>
                    <audio src={lista.url} controls />
                    <hr />
                  </div>
        })}
        </div>

      </AppContainer>
    );
  }
}

export default App;