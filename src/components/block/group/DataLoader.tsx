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
      fetchingData: false,
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

    if (isDataLoaded(data)) {
      if (fetchingData) {
        this.setState({ fetchingData: false, error: null });
      }
    } else {
      this.loadData();
    }
  }

  public async loadData() {
    const { loadData, isDataLoaded, data } = this.props;
    const { fetchingData } = this.state;
    console.log(this);

    if (!isDataLoaded(data)) {
      if (!fetchingData) {
        try {
          this.setState({ fetchingData: true });
          await loadData(data);
          this.setState({ fetchingData: false, error: null });
        } catch (error) {
          this.setState({ error });
        }
      }
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
      console.log(this);
      return render(data);
    }
  }
}
