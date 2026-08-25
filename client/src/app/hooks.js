import { useDispatch, useSelector } from 'react-redux';

// Use these everywhere instead of plain useDispatch / useSelector
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;