import { useReducer, useEffect } from 'react';
import axios from 'axios';

const ACTIONS = {
  MAKE_REQUEST: "make-request",
  GET_DATA: 'get-data',
  ERROR: 'error',
  UPDATE_HAS_NEXT_PAGE: 'update-has-next-page'
}

function reducer(state, action) {
  switch(action.type) {
    case ACTIONS.MAKE_REQUEST:
      return { loading: true, jobs: [] }
    case ACTIONS.GET_DATA:
      return { ...state, loading: false, jobs: action.payload.jobs }
    case ACTIONS.ERROR:
      return { ...state, loading: false, error: action.payload.error, jobs: [] }
    case ACTIONS.UPDATE_HAS_NEXT_PAGE:
      return { ...state, hasNextPage: action.payload.hasNextPage }
    default: 
      return state;
  }
}

//https://jobs.github.com/api
//http://cors-anywhere.herokuapp.com/
const BASE_URL = 'http://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json?'; 

export default function useFetchJobs(params, page) {
  
  const [state, dispatch] = useReducer(reducer, { jobs: [], loading: true });

  useEffect(() => { 
    const cancelTokenOne = axios.CancelToken.source();
    dispatch({ type: ACTIONS.MAKE_REQUEST });
    axios.get(BASE_URL, { markdown: true, page: page, ...params }
    ).then(res => {
      dispatch({ type: ACTIONS.GET_DATA, payload: { jobs: res.data }});
    }).catch(e => {
      if (axios.isCancel(e)) return
      dispatch({ type: ACTIONS.ERROR, payload: { error: e }});
    });

    const cancelTokenTwo = axios.CancelToken.source();
    axios.get(BASE_URL, {
      params: { markdown: true, page: page + 1, ...params }
    }).then(res => {
      dispatch({ type: ACTIONS.UPDATE_HAS_NEXT_PAGE, payload: { hasNextPage: res.data.length > 0 }});
    }).catch(e => {
      if (axios.isCancel(e)) return
      dispatch({ type: ACTIONS.ERROR, payload: { error: e }});
    });

    return () => { //Se os parametros forem alterados antes de atualizar o state, chama o retorno.
      cancelTokenOne.cancel()
      cancelTokenTwo.cancel()
    }
  }, [params, page]);
  
  return state;
}