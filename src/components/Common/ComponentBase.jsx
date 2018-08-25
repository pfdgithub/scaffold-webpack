import ReactBase from 'commons/ReactBase';

class ComponentBase extends ReactBase {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    super.componentDidMount();
  }

  componentWillUnmount() {
    super.componentWillUnmount();
  }
}

export default ComponentBase;