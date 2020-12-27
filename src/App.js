import { useState } from 'react';
import useFetchJobs from './useFetchJobs';
import { Container } from 'react-bootstrap';
import Job from './Job';
import JobPagination from './JobPagination';
import SearchForm from './SearchForm';

function App() {
  const [params, setParams] = useState([]);
  const [page, setPage] = useState(1);
  const {jobs, loading, error, hasNextPage} = useFetchJobs(params, page);
  
  function handleParamChange(e) {
    const param = e.target.name;
    const value = e.target.value;
    setPage(1);
    setParams(prevParams => {
      return { ...prevParams, [param]: value };
    });
  }

  return (
   <>
    <Container className="my-4">
      {!loading && <h1 className="mb-4">GitHub Jobs</h1>}
      <SearchForm params={params} onParamChange={handleParamChange}></SearchForm>
      <JobPagination 
        page={page} 
        setPage={setPage} 
        hasNextPage={hasNextPage} 
        loading={loading}
      />
      {loading && <h1>Loading...</h1>}
      {error && <h1>Error. Try to refresh the page.</h1>}
      {jobs.length > 0 && jobs.map(job => {
        return <Job key={job.id} job={job}/>
      })}
      <JobPagination 
        page={page} 
        setPage={setPage} 
        hasNextPage={hasNextPage} 
        loading={loading}
      />
    </Container>
   </>
  );
}

export default App;
