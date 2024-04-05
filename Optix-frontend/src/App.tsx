import React, { useEffect, useState } from 'react';
import { Button, TextField, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Snackbar, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, useMediaQuery, useTheme } from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

interface Movie {
  id: string;
  reviews: number[];
  title: string;
  filmCompanyId: string;
}

interface MovieCompany {
  id: string;
  name: string;
}

let API_BASE_URL = 'http://localhost:3000';
if (typeof process !== 'undefined' && process.env.REACT_APP_API_URL) {
    API_BASE_URL = process.env.REACT_APP_API_URL;
}

const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieCompanies, setMovieCompanies] = useState<MovieCompany[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortBy, setSortBy] = useState<'reviews' | 'title' | 'filmCompanyId'>('reviews');
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchMovies();
    fetchMovieCompanies();
  }, []);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleError = (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    setSnackbarMessage(errorMessage);
  };

  async function fetchMovies() {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/movies`);
      if (!response.ok) throw new Error('Failed to fetch movies');
      setMovies(await response.json());
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMovieCompanies() {
    try {
      const response = await fetch(`${API_BASE_URL}/movieCompanies`);
      if (!response.ok) throw new Error('Failed to fetch movie companies');
      setMovieCompanies(await response.json());
    } catch (error) {
      handleError(error);
  
      // Retry fetching movie companies after a short delay (e.g., 1 second)
      setTimeout(fetchMovieCompanies, 1000);
    }
  }
  

  function handleSelectMovie(movie: Movie) {
    setSelectedMovie(movie);
    setReviewMessage('');
  }

  async function handleSubmitReview() {
    if (!selectedMovie || reviewMessage.trim().length < 3) {
        setSnackbarMessage('You must write at least 3 characters.');
        return;
    }

    try {
        // Simulate submitting review
        setTimeout(() => {
          setSnackbarMessage('Review submitted successfully');
          setOpenModal(false);
          setReviewMessage('');
        }, 1000);
    } catch (error) {
        handleError(error);
    }
  }

  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReviewMessage(e.target.value);
  };

  const averageScore = (reviews: number[]) => {
    return reviews.reduce((acc, score) => acc + score, 0) / reviews.length;
  };

  const characterCount = reviewMessage.length;
  const maxCharacters = 100;
  const maxCharacterReached = characterCount >= maxCharacters;

  const handleSort = (column: keyof Movie) => {
    setSortBy(column);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortedMovies = movies.slice().sort((a, b) => {
    if (sortBy === 'reviews') {
      return sortOrder === 'asc' ? averageScore(a.reviews) - averageScore(b.reviews) : averageScore(b.reviews) - averageScore(a.reviews);
    } else {
      return sortOrder === 'asc' ? (a[sortBy] > b[sortBy] ? 1 : -1) : (b[sortBy] > a[sortBy] ? 1 : -1);
    }
  });

  if (loading) return <CircularProgress />;

  return (
    <div className='main-wrapper'>
      <div className="header">
        <h1>Welcome to Movie database!</h1>
      </div>
      <div className="container">
        <div className="table-settings">
          <p>Total movies displaying: {movies.length}</p>
          <Button variant="contained" onClick={fetchMovies}>Refresh</Button>
        </div>

        <div className="table-wrapper">
          <Table className='table'>
            <TableHead className='TableHead'>
              <TableRow>
                <TableCell>
                  Title 
                </TableCell>
                <TableCell className='main-table-head' onClick={() => handleSort('reviews')}>
                  Average Review {sortBy === 'reviews' && (sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />)}
                </TableCell>
                <TableCell>
                  Film Company
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedMovies.map((movie) => (
                <TableRow 
                  key={movie.id} 
                  onClick={() => handleSelectMovie(movie)}
                  style={{ backgroundColor: selectedMovie?.id === movie.id ? '#f0f0f0' : 'transparent' }}
                >
                  <TableCell>{movie.title}</TableCell>
                  <TableCell>{averageScore(movie.reviews).toFixed(1)}</TableCell>
                  <TableCell>{movieCompanies.find(company => company.id === movie.filmCompanyId)?.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {isSmallScreen ? (
          <>
            <Button variant="contained" onClick={() => setOpenModal(true)}>Submit Review</Button>
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
              <DialogTitle>Submit Review</DialogTitle>
              <DialogContent>
                <TextField
                  label="Review"
                  value={reviewMessage}
                  onChange={handleReviewChange}
                  error={maxCharacterReached}
                  helperText={
                    maxCharacterReached
                      ? `You reached the maximum characters allowed (${maxCharacters})`
                      : `You've used ${characterCount} out of ${maxCharacters} maximum characters allowed.`
                  }
                  fullWidth
                  margin="normal"
                  inputProps={{ maxLength: maxCharacters }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenModal(false)}>Cancel</Button>
                <Button onClick={handleSubmitReview}>Submit</Button>
              </DialogActions>
            </Dialog>
          </>
        ) : (
          <div>
            <TextField
              label="Review"
              value={reviewMessage}
              onChange={handleReviewChange}
              error={maxCharacterReached}
              helperText={
                maxCharacterReached
                  ? `You reached the maximum characters allowed (${maxCharacters})`
                  : `You've used ${characterCount} out of ${maxCharacters} maximum characters allowed.`
              }
              fullWidth
              margin="normal"
              inputProps={{ maxLength: maxCharacters }}
            />
            <Button variant="contained" onClick={handleSubmitReview}>Submit Review</Button>
          </div>
        )}

        <Snackbar
          open={!!snackbarMessage}
          autoHideDuration={6000}
          onClose={() => setSnackbarMessage(null)}
          message={snackbarMessage}
        />
      </div>
    </div>
  );
};

export default App;
