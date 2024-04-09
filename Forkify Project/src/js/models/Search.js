import axios from 'axios';
import { key, proxy } from '../config';

export default class Search {
  constructor(query) {
    this.query = query;
  }
  async getResults(query) {
    try {
      const res = await axios(`${proxy}/https://forkify-api.herokuapp.com/api/search?key=${key}&q=${this.query}`);

      // console.log(res);
      this.result = res.data.recipes;
      // console.log(this.result);
    }
    catch (error) {
      console.log(error);
    }
  }
}