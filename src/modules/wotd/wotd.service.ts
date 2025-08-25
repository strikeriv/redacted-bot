import axios from 'axios';
import { from, map, Observable } from 'rxjs';
import { WordOfTheDayResponse } from './wotd.types';

export const wotdService = {
  getTodaysWordOfTheDay: (): Observable<WordOfTheDayResponse> => {
    return from(
      axios.request<WordOfTheDayResponse>({
        method: 'GET',
        url: `https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key=${Bun.env.WOTD_API_KEY}`,
      })
    ).pipe(map((response) => response.data));
  },
};
