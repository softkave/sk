import React from "react";

export interface IDataLoaderProps {
  isDataLoaded: (data: any) => boolean;
  areDataSame: (data1: any, data2: any) => boolean;
  loadData: (data: any) => void;
  render: (data: any) => React.ReactNode;
  data?: any;
}

interface IDataLoaderState {
  fetchingData: boolean;
  error?: Error | null;
}

export default class DataLoader extends React.Component<
  IDataLoaderProps,
  IDataLoaderState
> {
  public static defaultProps = {
    areDataSame: () => false
  };

  constructor(props) {
    super(props);
    this.state = {
      fetchingData: true,
      error: null
    };
  }

  public componentDidMount() {
    this.loadData();
  }

  public componentDidUpdate(prevProps) {
    const { areDataSame } = this.props;

    if (!areDataSame(this.props.data, prevProps.data)) {
      this.loadData();
    } else {
      this.updateFetchingState();
    }
  }

  public updateFetchingState() {
    const { isDataLoaded, data } = this.props;
    const { fetchingData } = this.state;

    if (isDataLoaded(data) && fetchingData) {
      this.setState({ fetchingData: false, error: null });
    }
  }

  public async loadData() {
    const { loadData, isDataLoaded, data } = this.props;
    const { fetchingData } = this.state;
    const newState: Partial<IDataLoaderState> = {};

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
      this.setState((newState as unknown) as IDataLoaderState);
    }
  }

  public render() {
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
