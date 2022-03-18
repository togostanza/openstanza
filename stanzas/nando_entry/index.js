import Stanza from 'togostanza/stanza';

export default class NandoEntry extends Stanza {
  async render() {

    console.log(this.params);

    // https://nanbyodata.jp/sparqlist/api/get_nando_entry_by_nando_id?nando_id=1200001
    const apiUrl = 'https://nanbyodata.jp/sparqlist/api/';
    const apiName = 'get_nando_entry_by_nando_id?nando_id=' + this.params.nando_id;
    let options = {
      method: 'GET',
      mode:  'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };
    fetch(
      apiUrl + apiName,
      options
    )
    .then(res => res.json())
    .then(json => {
      console.log(json);
      this.renderTemplate(
        {
          template: 'stanza.html.hbs',
          parameters: {
            result: json
          }
        }
      );
    });
  
  }
}
