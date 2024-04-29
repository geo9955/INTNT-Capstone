import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lastView: "",
      content: ""
    }
  }

  componentDidMount() {
    this.loadTable("");
  }

  changeBook(id) {
    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({id: id}),
    }
    fetch("http://localhost:4000", options)
      .then(() => this.loadTable(this.state.lastView))
  }

  loadTable(avail) {
    this.setState({lastView: avail});
    fetch("http://localhost:4000" + avail)
    .then((res) => res.json())
    .then((res) => this.setState({content: <table className='center'>
      <thead>
      <tr className='tableHeader'>
        <th>Id</th>
        <th>Title</th>
        <th>Author</th>
        <th>Publisher</th>
        <th>ISBN</th>
        <th>Available</th>
        <th>Borrower</th>
        <th>Due</th>
        <th> </th>
      </tr>
    </thead>
    <tbody>
      {res.map((book) => (
        <tr className={book.avail === "true" ? "checkedIn" : "checkedOut"}key={book.id}>
          <td>{book.id}</td>
          <td>{book.title}</td>
          <td>{book.author}</td>
          <td>{book.publisher}</td>
          <td>{book.isbn}</td>
          <td>{book.avail}</td>
          <td>{book.who}</td>
          <td>{book.due}</td>
          <td ><button onClick={() => 
            this.changeBook(book.id)}>Check {book.avail === "true" ? "Out" : "In"}</button></td>
        </tr>
      ))}
    </tbody></table>}));
  }

  
  

  render() {
    return (<div className='center'>
      <div className='header'>
        <h1>Welcome to the Library!</h1>
        <p>Check out a book, will ya?</p>
        </div>
    <div>{this.state.content}</div>
    <div>
      <button onClick={() => this.loadTable("")}>Show All</button>
      <button onClick={() => this.loadTable("?avail=true")}>Show Available</button>
      <button onClick={() => this.loadTable("?avail=false")}>Show Not Available</button>
    </div></div>);
  }
}

export default App;
