import React from 'react';
import { stepsStyles, CHECKOUT_STEPS } from './styles';

const CheckOutSteps = ({ current = 0 }) => {
  return (
    <div className={stepsStyles.wrapper}>
      {CHECKOUT_STEPS.map((step, index) => (
        <React.Fragment key={step}>
          <div
            className={
              index === current
                ? stepsStyles.stepActive
                : stepsStyles.stepInactive
            }
          >
            {step}
          </div>
          {step !== 'Place Order' && <hr className={stepsStyles.divider} />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckOutSteps;
