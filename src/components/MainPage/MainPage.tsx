import Offer from './Offer/Offer.tsx';
import CardsTable from './CardsTable/CardsTable.tsx';
import Feedback from './Feedback/Feedback.tsx';
import Footer from './Footer/Footer.tsx';
import styles from './MainPage.module.css';

function MainPage() {
    return(
        <div className={styles.mainPageContainer}>
            <Offer/>
            <CardsTable/>
            <Feedback/>
            <Footer/>
        </div>
    )
}

export default MainPage;