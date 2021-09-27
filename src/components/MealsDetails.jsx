import React, { useEffect, useState, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Carousel, Button } from 'react-bootstrap';
import { fetchIdMeals } from '../Service/foodApi';
import { fetchAllDrinks } from '../Service/drinkApi';

import ShareButton from './ShareButton';
import RecipesContext from '../Context/RecipesContext';
import FavoriteButton from './FavoriteButton';

export default function MealsDetails() {
  const {
    stateMeals,
    setStateMeals,
    ingredientsMeals,
    setIngredientsMeals,
    measureMeals,
    setMeasureMeals,
  } = useContext(RecipesContext);
  const { pathname } = useLocation();
  const [drinksAll, setDrinksAll] = useState([{ strDrink: '' }]);
  const [stateChangeHeart, setStateChangeHeart] = useState(true);
  const [invisibleButton, setInvisibleButton] = useState(false);
  const [checkButtonstate, setChekButtonState] = useState(false);

  const filterDetails = () => {
    const keysIngredientes = Object.keys(stateMeals[0]);
    const arrayKeysIngredients = keysIngredientes
      .filter((e) => e.includes('strIngredient'));
    const ingredient = [];
    const measures = [];

    const arrayKeysMeasure = keysIngredientes.filter((e) => e.includes('strMeasure'));
    arrayKeysMeasure.forEach((element) => measures.push(stateMeals[0][element]));
    arrayKeysIngredients.forEach((element) => ingredient.push(stateMeals[0][element]));
    const filtroIngredients = ingredient.filter((word) => word !== '');
    const filtroMeasure = measures.filter((word) => word !== ' ');
    setIngredientsMeals(filtroIngredients);
    setMeasureMeals(filtroMeasure);
  };

  const getApiDetails = () => {
    const SIX = 6;
    const id = pathname.split('/')[2];
    fetchIdMeals(id).then((result) => setStateMeals(result));
    fetchAllDrinks().then((result) => setDrinksAll(result.filter((_e, i) => i < SIX)));
  };

  useEffect(getApiDetails, []);
  useEffect(filterDetails, [stateMeals]);

  const id = pathname.split('/')[2];
  const removeFavorited = () => {
    const favorited = JSON.parse(localStorage.getItem('favoriteRecipes'));
    if (favorited) {
      const filterLocalStorage = favorited.filter(
        (element) => element.id !== id,
      );
      localStorage.setItem(
        'favoriteRecipes',
        JSON.stringify(filterLocalStorage),
      );
    }
  };

  const verifyHeart = () => {
    const favorited = JSON.parse(localStorage.getItem('favoriteRecipes'));
    if (favorited) {
      const filterLocalStorage = favorited.some((element) => element.id === id);
      if (filterLocalStorage) {
        setStateChangeHeart(false);
      }
    }
  };

  useEffect(verifyHeart, []);

  const checkButton = () => {
    const recipeFinish = JSON.parse(localStorage.getItem('doneRecipes') || ('[]'));
    const buttonInvisible = recipeFinish.some((element) => element.id === id);
    setInvisibleButton(buttonInvisible);
  };
  useEffect(checkButton, []);

  const {
    strMealThumb,
    strMeal,
    strCategory,
    strInstructions,
    strVideo,
    idMeal,
  } = stateMeals[0];

  const changeButton = () => {
    const url = pathname.split('/')[2];
    const { meals } = JSON.parse(localStorage.getItem('inProgressRecipes') || ('{}'));
    const keysCocktais = meals ? Object.keys(meals) : [];
    const checkKeys = keysCocktais.includes(url);
    setChekButtonState(checkKeys);
  };
  useEffect(changeButton, []);

  return (
    <>
      <img
        src={ strMealThumb }
        alt="foto da comida"
        data-testid="recipe-photo"
        width="100%"
      />
      <div className="in_progress_recipes">
        <h1 data-testid="recipe-title">{strMeal}</h1>
        <div className="favorite-share">
          <ShareButton />
          <FavoriteButton
            stateChangeHeart={ stateChangeHeart }
            setStateChangeHeart={ setStateChangeHeart }
            removeFavorited={ removeFavorited }
          />
        </div>
        <h5 data-testid="recipe-category">{strCategory}</h5>
        <h3>Ingredients</h3>
        <ul>
          {ingredientsMeals.map((ingredient, index) => (
            <li data-testid={ `${index}-ingredient-name-and-measure` } key={ index }>
              {`${ingredient} ${
                measureMeals[index] !== undefined ? `-${measureMeals[index]}` : ''
              }`}
            </li>
          ))}
        </ul>
        <h3>Instructions</h3>
        <p data-testid="instructions" className="instrucoesP">
          {strInstructions}
          {' '}

        </p>
        <Carousel>
          {drinksAll.map((drink, index) => (
            <Carousel.Item
              interval={ 850 }
              key={ index }
              data-testid={ `${index}-recomendation-card` }
            >
              <img
                className="w-100"
                src={ drink.strDrinkThumb }
                alt="slide"
              />
              <Carousel.Caption data-testid={ `${index}-recomendation-title` }>
                <h3>{drink.strDrink}</h3>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
        <div className="button-recipes">
          <Link to={ `/comidas/${idMeal}/in-progress` }>
            <Button
              variant="danger"
              type="button"
              data-testid="start-recipe-btn"
              className={ invisibleButton ? 'iniciarReceitaInvisible' : 'iniciarReceita' }
            >
              {checkButtonstate ? 'Continuar Receita' : 'Iniciar Receita' }
            </Button>
          </Link>
        </div>

      </div>
    </>
  );
}
