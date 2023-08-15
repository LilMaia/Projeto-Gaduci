import InitialPageHeader from '../../components/initial-page/InitialPageHeader';
import InitialPageContent from '../../components/initial-page/InitialPageContent';
import InitialPageFooter from '../../components/initial-page/InitialPageFooter';

function InitialPage() {
  return (
    <div className="InitialPage">
        <InitialPageHeader/>
        <InitialPageContent/>
        <InitialPageFooter/>
    </div>
  );
}

export default InitialPage;
