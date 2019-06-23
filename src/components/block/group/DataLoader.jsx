import React from "react";

export default class DataLoader extends React.Component {
  static defaultProps = {
    areDataSame: () => false
  };

  constructor(props) {
    super(props);
    this.state = {
      fetchingData: true,
      error: null
    };
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { areDataSame } = this.props;

    if (!areDataSame(this.props.data, prevProps.data)) {
      this.loadData();
    } else {
      this.updateFetchingState();
    }
  }

  updateFetchingState() {
    const { isDataLoaded, data } = this.props;
    const { fetchingData } = this.state;

    if (isDataLoaded(data) && fetchingData) {
      this.setState({ fetchingData: false, error: null });
    }
  }

  async loadData() {
    const { loadData, isDataLoaded, data } = this.props;
    const { fetchingData } = this.state;
    let newState = {};

    if (!isDataLoaded(data)) {
      try {
        await loadData(data);
        newState.fetchingData = false;
        newState.error = null;
      } catch (error) {
        newState.error = error;
      }
    } else if (fetchingData) {
      newState.fetchingData = false;
      newState.error = null;
    }

    if (Object.keys(newState).length > 0) {
      this.setState(newState);
    }
  }

  render() {
    const { data, render } = this.props;
    const { fetchingData, error } = this.state;

    if (fetchingData) {
      return "Loading";
    } else if (error) {
      return "An error occurred.";
    } else {
      return render(data);
    }
  }
}
