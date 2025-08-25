import { from, map, Observable, tap } from 'rxjs';
import { WordOfTheDayResponse } from './wotd.types';
import axios from 'axios';

export const wotdService = {
  getTodaysWordOfTheDay: (): Observable<WordOfTheDayResponse> => {
    return from(
      axios.request<WordOfTheDayResponse>({
        method: 'GET',
        url: `https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key=${Bun.env.WOTD_API_KEY}`,
      })
    ).pipe(
      tap((data) => console.log(data)),
      map((response) => response.data)
    );
  },
};
