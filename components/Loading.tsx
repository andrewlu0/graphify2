import React from "react";
import ReactLoading from "react-loading";

interface LoadingProps {}

export const Loading: React.FC<LoadingProps> = ({}) => {
  return <ReactLoading type="spinningBubbles" color="white" height={'50px'} width={'50px'} />
};
