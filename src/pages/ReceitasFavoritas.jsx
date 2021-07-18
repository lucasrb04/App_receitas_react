import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import FiltersButtons from '../components/FiltersButtons';
import RecipesContext from '../Context/RecipesContext';
import ShareButtonPerfil from '../components/ShareButtonPerfil';
import ScreenFavoriteButton from '../components/ScreenFavoriteButton';
import '../styles/ReceitasFavoritasStyle.css';

function ReceitasFavoritas() {
  const { favoriteFilters } = useContext(RecipesContext);
  const history = useHistory();
  const areaAndCategory = (area, category) => category
  && `${area} - ${category}`;

  return (
    <>
      <Header />
      <main>
        <FiltersButtons />
        <section>
          { favoriteFilters === null
            ? <p />
            : favoriteFilters.map((
              {
                image,
                category,
                name,
                id,
                area,
                type,
                alcoholicOrNot,
              }, index,
            ) => (
              <div key={ id } className="card-receitas-favoritas">
                <button type="button" variant="outline-light" onClick={ () => history.push(`/${type}s/${id}`) }>
                  <img
                    src={ image }
                    alt="xxxx"
                    data-testid={ `${index}-horizontal-image` }
                    width="50px"
                  />
                </button>
                <button type="button" variant="outline-light" onClick={ () => history.push(`/${type}s/${id}`) }>
                  <span
                    data-testid={ `${index}-horizontal-name` }
                  >
                    { name }
                  </span>
                </button>
                <ShareButtonPerfil type={ type } id={ id } index={ index } />
                <ScreenFavoriteButton
                  id={ id }
                  index={ index }
                />
                <div data-testid={ `${index}-horizontal-top-text` }>
                  { areaAndCategory(area, category) }
                </div>
                {
                  alcoholicOrNot
              && <h3 data-testid={ `${index}-horizontal-top-text` }>{ alcoholicOrNot }</h3>
                }
              </div>
            ))}
        </section>
      </main>
    </>
  );
}

export default ReceitasFavoritas;
