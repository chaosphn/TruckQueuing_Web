
import truckImg from '../../assets/truck.png';
import wheelImg from '../../assets/wheel.png';
import styles from './truck-model.module.css';

function TruckModel() {

  return (
    <div className={styles.wrapper}>
      <img src={truckImg} alt='truck' height={150} className={styles.truck} />
      {/* <img src={wheelImg} alt='w1' height={10} className={styles.wheel1} />
      <img src={wheelImg} alt='w1' height={10} className={styles.wheel2} />
      <img src={wheelImg} alt='w1' height={10} className={styles.wheel3} /> */}
    </div>
  );
}

export default TruckModel;