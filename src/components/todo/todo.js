import React, { Component } from 'react';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Todo from './todoItem';
import InsertForm from './insertForm';
import Preview from './preview';
import * as TodoService from '../../service/todoService';
import Filter from './filter';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      filtered: [],
      preview: { value: '', data: new Date().toISOString() },
      creationDate: new Date().toISOString(),
    };
  }

  insert = (value) => {
    TodoService.save(this.props.jwt, { value, data: new Date() }).then(
      (saved) => {
        const newList = [...this.state.items, saved];
        this.setState({ items: newList, filtered: [...newList] });
      }
    );
  };

  remove = (item) => {
    TodoService.deleteItem(this.props.jwt, item._id).then((deleted) => {
      const newList = this.state.items.filter((todo) => todo._id !== item._id);
      this.setState({ items: newList, filtered: [...newList] });
    });
  };

  update = (item) => {
    console.log('item', item);
    TodoService.update(this.props.jwt, item._id, item).then((data) => {
      const newList = this.state.items.map((data) =>
        data._id !== item._id ? data : item
      );
      this.setState({ items: newList, filtered: [...newList] });
    });
  };

  filter = (value) => {
    this.setState({
      filtered: this.state.items.filter(
        (data) => data.value.indexOf(value) > -1
      ),
    });
  };

  valueChanged = (value) => {
    this.setState({ preview: { value, data: new Date().toISOString() } });
  };

  componentDidMount() {
    TodoService.getAll(this.props.jwt).then((lst) => {
      this.setState({ items: [...lst], filtered: [...lst] });
    });
  }

  render() {
    return (
      <div className="container">
        <div className="py-5 text-center">
          <h1>TODO List</h1>
        </div>
        <div className="row g-5">
          <div className="col-md-5 col-lg-4 order-md-last">
            <InsertForm insert={this.insert} valueChanged={this.valueChanged} />
            <div className="my-2">
              <Preview item={this.state.preview} />
            </div>
          </div>
          <div className="col-md-7 col-lg-8">
            <Filter filter={this.filter} />
            {!!this.state.filtered.length &&
              this.state.filtered.map((item, idx) => (
                <Todo
                  key={idx}
                  disableOthersEditMode={this.disableOthersEditMode}
                  item={item}
                  update={this.update}
                  remove={this.remove}
                />
              ))}

            {!!!this.state.filtered.length && (
              <div className="card border-secondary mb-3">
                <div className="card-header">
                  <div className="d-flex justify-content-between">
                    <div>No data</div>
                    <div></div>
                  </div>
                </div>
                <div className="card-body text-secondary">
                  <h5 className="card-title">No data found</h5>
                  <p className="card-text">{this.state.creationDate}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
