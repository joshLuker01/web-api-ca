import React, { useState } from "react";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MonetizationIcon from "@mui/icons-material/MonetizationOn";
import StarRate from "@mui/icons-material/StarRate";
import NavigationIcon from "@mui/icons-material/Navigation";
import Fab from "@mui/material/Fab";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import MovieReviews from "../movieReviews"
import { useQuery } from "@tanstack/react-query";
import { getMovieCredits } from "../../api/tmdb-api";
import { getMovieRecommendations } from "../../api/tmdb-api";
import Spinner from "../spinner";



const root = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  listStyle: "none",
  padding: 1.5,
  margin: 0,
};
const chip = { margin: 0.5 };

const MovieDetails = ({ movie }) => {  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: credits, isPending: creditsLoading } = useQuery({
    queryKey: ["credits", { id: movie.id }],
    queryFn: getMovieCredits,
  });

  const { data: recommendations, isPending: recsLoading } = useQuery({
    queryKey: ["recommendations", { id: movie.id }],
    queryFn: getMovieRecommendations,
  });


  if (creditsLoading) {
    return <Spinner />;
  }




  return (
    <>
      <Typography variant="h5" component="h3">
        Overview
      </Typography>

      <Typography variant="h6" component="p">
        {movie.overview}
      </Typography>

      <Paper
        component="ul"
        sx={{ ...root }}
      >
        <li>
          <Chip label="Genres" sx={{ ...chip }} color="primary" />
        </li>
        {movie.genres.map((g) => (
          <li key={g.name}>
            <Chip label={g.name} sx={{ ...chip }} />
          </li>
        ))}
      </Paper>
      <Paper
        component="ul"
        sx={{ ...root }}
      >
        <li>
          <Chip label="Production Countries" sx={{ ...chip }} color="primary" />
        </li>
        {movie.production_countries.map((c) => (
          <li key={c.iso_3166_1}>
            <Chip label={c.name} sx={{ ...chip }} />
          </li>
        ))}
      </Paper>



      <Paper component="ul" sx={{ ...root }}>
        <Chip icon={<AccessTimeIcon />} label={`${movie.runtime} min.`} />
        <Chip
          icon={<MonetizationIcon />}
          label={`${movie.revenue.toLocaleString()}`}
        />
        <Chip
          icon={<StarRate />}
          label={`${movie.vote_average} (${movie.vote_count})`}
        />
        <Chip label={`Released: ${movie.release_date}`} />
      </Paper>

      {credits && (
        <>
          <Typography variant="h5" component="h3">
            Cast & Crew
          </Typography>


          <Paper component="ul" sx={{ ...root }}>
            <li>
              <Chip label="Director" sx={{ ...chip }} color="primary" />
            </li>

            {credits.crew
              .filter((person) => person.job === "Director")
              .map((director) => (
                <li key={director.credit_id}>
                  <Chip label={director.name} sx={{ ...chip }} />
                </li>
              ))}
          </Paper>


          <Paper component="ul" sx={{ ...root }}>
            <li>
              <Chip label="Cast" sx={{ ...chip }} color="primary" />
            </li>

            {credits.cast.slice(0, 10).map((actor) => (
              <li key={actor.cast_id}>
                <Chip
                  label={`${actor.name} as ${actor.character}`}
                  sx={{ ...chip }}
                />
              </li>
            ))}
          </Paper>
        </>
      )}


{recommendations && (
  <>
    <Typography variant="h5" component="h3">
      Recommended Movies
    </Typography>

    <Paper component="ul" sx={{ ...root }}>
      <li>
        <Chip label="Recommendations" sx={{ ...chip }} color="primary" />
      </li>

      {recommendations.results.slice(0, 10).map((rec) => (
        <li key={rec.id}>
          <Chip label={rec.title} sx={{ ...chip }} />
        </li>
      ))}
    </Paper>
  </>
)}

      <Fab
        color="secondary"
        variant="extended"
        onClick={() => setDrawerOpen(true)}
        sx={{
          position: 'fixed',
          bottom: '1em',
          right: '1em'
        }}
      >
        <NavigationIcon />
        Reviews
      </Fab>
      <Drawer anchor="top" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <MovieReviews movie={movie} />
      </Drawer>

    </>
  );
};
export default MovieDetails;
