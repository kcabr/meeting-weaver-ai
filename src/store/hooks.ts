/**
 * @description
 * Defines and exports typed hooks for interacting with the Redux store.
 * Using these hooks ensures type safety when dispatching actions or selecting state.
 *
 * Key features:
 * - Exports 'useAppDispatch': A pre-typed version of 'useDispatch'.
 * - Exports 'useAppSelector': A pre-typed version of 'useSelector'.
 *
 * @dependencies
 * - react-redux: Provides the base 'useDispatch' and 'useSelector' hooks.
 * - ./index: Imports the 'RootState' and 'AppDispatch' types from the store configuration.
 *
 * @notes
 * - These hooks should be used throughout the application instead of the plain 'useDispatch' and 'useSelector'
 *   from 'react-redux' to maintain type safety.
 * - Example usage:
 *   '''typescript
 *   import { useAppSelector, useAppDispatch } from '~/store/hooks';
 *   import { setContextText } from '~/store/slices/contextSlice';
 *
 *   const MyComponent = () => {
 *     const contextText = useAppSelector((state) => state.context.text);
 *     const dispatch = useAppDispatch();
 *
 *     const handleClick = () => {
 *       dispatch(setContextText('New text'));
 *     };
 *     // ...
 *   };
 *   '''
 */

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

/**
 * @description Typed hook for dispatching Redux actions.
 * Use throughout your app instead of plain 'useDispatch'.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * @description Typed hook for selecting data from the Redux store.
 * Use throughout your app instead of plain 'useSelector'.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
