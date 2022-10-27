import type { FC } from "react";
import React from "react";
import { useAppSelector, useAppDispatch } from "@store";
import { increment, decrement } from "@store/modules/counter";
import { Button } from "antd-mobile";

const Home: FC = () => {
  const counter = useAppSelector(state => state.counter);
  const dispatch = useAppDispatch();

  const handleClickIncrement = () => dispatch(increment());
  const handleClickDecrement = () => dispatch(decrement());

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
      <div className="flex justify-center items-center">
        <Button color="primary" fill="outline" onClick={handleClickIncrement}>
          increment
        </Button>
        <span className="text-center mx-8">Count: {counter.count}</span>
        <Button onClick={handleClickDecrement}>decrement</Button>
      </div>
    </div>
  );
};

export default Home;
