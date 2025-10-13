import { connect } from "react-redux";
import { increase, decrease } from "../modules/counter";
import Counter from "../components/Counter";
import { Preloader } from "../lib/PreloadContext";

const CounterContainer = ({ number, increase, decrease }) => {
  return (
    <>
      <Counter number={number} onIncrease={increase} onDecrease={decrease} />
      <Preloader resolve={() => increase} />
      <Preloader resolve={() => decrease} />
    </>
  );
};

export default connect(
  (state) => ({
    number: state.counter,
  }),
  {
    increase,
    decrease,
  }
)(CounterContainer);
