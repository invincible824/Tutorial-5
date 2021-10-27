const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  //if (dateRegex.test(value)) return new Date(value);
  return value;
}


async function graphQLFetch(query, variables = {}) {
  console.log('graphQL')

  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ query, variables })
    });
    const body = await response.text();
    //const result = body
    const result = JSON.parse(body, jsonDateReviver);

    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code == 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }
    return result.data;
  } catch (e) {
    alert(`Error in sending data to server: ${e.message}`);
  }
}

function IssueRow(props) {
  const issue = props.issue;
  return (
    <tr>
      <td>{issue.id}</td>
      <td>{issue.name}</td>
      <td>{issue.phone}</td>
      <td>{issue.created}</td>
    </tr>
  );
}

function IssueTable(props) {
  const issueRows = props.issues.map(issue =>
    <IssueRow key={issue.id} issue={issue} />
  );
 
  console.log('test')
  console.log(props.issues)

  return (
    <table className="bordered-table" hidden={props.isShow}>
      <thead>
        <tr>
          <th>ID</th>
          <th>NAME</th>
          <th>PHONE</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        {issueRows}
      </tbody>
    </table>
  );
}

class HomePage extends React.Component{
    constructor(props) {
      super(props);
      this.handleMKBClick = this.handleMKBClick.bind(this)
      this.handleBack2Homepage = this.handleBack2Homepage.bind(this)
      this.handleDisplay = this.handleDisplay.bind(this)
      this.handleModify = this.handleModify.bind(this)
      this.handleSubmitSuccess = this.handleSubmitSuccess.bind(this)
      this.createIssue = this.createIssue.bind(this);
      this.deleteIssue = this.deleteIssue.bind(this);
      
      
      this.state = {
          issues: [],
          guestlist: [],
          count:0,
          isAtHome: true,
          isAtResearvation: false,
          isAtDisplay: false,
          isAtModify: false,
          availableSlots: 25,
          isSubmitSuccess: false,
      }
    }
    
    componentDidMount() {
      console.log('ComponentDid')
      this.loadData();
    }

    addGuest = (guestInfo) => {
      const copyGuestlist = this.state.guestlist
      copyGuestlist.push(guestInfo)
      this.setState({guestlist: copyGuestlist})
  
      var copycount = this.state.count
      copycount = copycount+1
      this.setState({count: copycount})
  
      var copyavailableSlots = this.state.availableSlots
      copyavailableSlots = copyavailableSlots - 1
      this.setState({availableSlots: copyavailableSlots})
    }
  
    deleteGuest = (guestInfo) => {
    
      const copyGuestlist = this.state.guestlist
      const newGuestlist = []
      for(var i=0;i<copyGuestlist.length;i++){
        if(copyGuestlist[i]!=guestInfo){
          newGuestlist.push(copyGuestlist[i])
        }
      }
      this.setState({guestlist: newGuestlist})
    
      var copyavailableSlots = this.state.availableSlots
      copyavailableSlots = copyavailableSlots + 1
      this.setState({availableSlots: copyavailableSlots})
    }
  
    handleMKBClick() {
      this.setState({isAtHome: false});
      this.setState({isAtResearvation: true})
    }
  
    handleDisplay() {
      this.setState({isAtHome: false});
      this.setState({isAtDisplay: true})
      console.log(this.state.issues)
      console.log(typeof(this.state.issues[1]))
      // console.log(this.state.issues[0][0])
      // console.log(this.state.issues[0].id)
      // console.log(this.state.issues[0].keys)
     // console.log(Object.keys(this.state.issues[0]))
      // console.log(this.state.issues.length)

    }
    
    handleModify(){
      this.setState({isAtHome: false});
      this.setState({isAtModify: true})
    }
  
  
    handleBack2Homepage() {
      this.setState({isAtHome: true});
      this.setState({isAtResearvation: false})
      this.setState({isAtDisplay: false})
      this.setState({isAtModify: false})
      this.setState({isSubmitSuccess: false})
    }
  
    handleSubmitSuccess(is_success) {
      if(is_success){
        this.setState({isSubmitSuccess: true});
      } else{
        this.setState({isSubmitSuccess: false});
      }
    }

    //loaddata
    async loadData() {
      console.log('load_data')
      const query = `query {
        issueList {
          id 
          name
          phone
          created
        }
      }`;
  
      const data = await graphQLFetch(query);
      if (data) {
        this.setState({ issues: data.issueList,
                        availableSlots: 25 - data.issueList.length});
      }
    }
    
    //write in data
    async createIssue(issue) {
      console.log('createissue')
      const query = `mutation issueAdd($issue: IssueInputs!) {
        issueAdd(issue: $issue) {
          id
        }
      }`;
  
      const data = await graphQLFetch(query, { issue });
      if (data) {
        this.loadData();
      }
    }

    //delete data
    async deleteIssue(issue) {
      console.log('deleteissue')
      const query = `mutation issueDelete($issue: IssueDelInputs!) {
        issueDelete(issue: $issue) {
          id
        }
      }`;
  
      const data = await graphQLFetch(query, { issue });
      if (data) {
        this.loadData();
      }
    }



    render(){
      const guestlist_cs = this.state.guestlist
      let MKB,DSB,MDB;
      const isstable = <IssueTable issues={this.state.issues} isShow={!this.state.isAtDisplay} />
      MKB = <MakeReservationButton onClick={this.handleMKBClick} isShow = {!this.state.isAtHome} />
      DSB = <Display onClick={this.handleDisplay} isShow={!this.state.isAtHome}/>
      MDB = <Modify onClick={this.handleModify} isShow={!this.state.isAtHome}/>
      const BHPB = <Back2HomepageButton onClick={this.handleBack2Homepage} isShow={this.state.isAtHome} />
      const ADDG = <AddGuest count = {this.state.count} createIssue = {this.createIssue}addGuest = {this.addGuest} guestlist = {this.state.guestlist} availableSlots={this.state.availableSlots} isSubmitSuccess={this.state.isSubmitSuccess} handleSubmitSuccess={this.handleSubmitSuccess} isShow = {!this.state.isAtResearvation}/>
      //const ST = <ShowTable guestlist={this.state.guestlist} issues={this.state.issues} isShow={!this.state.isAtDisplay}/>
      const MDG = <ModifyGuest guestlist={this.state.guestlist} deleteIssue = {this.deleteIssue} deleteGuest={this,this.deleteGuest} isSubmitSuccess={this.state.isSubmitSuccess} handleSubmitSuccess={this.handleSubmitSuccess} isShow={!this.state.isAtModify}/>
      return(
          <div>
          <h1> Restaurant Waitlist System </h1>
          <p> Available Slots: <span>{this.state.availableSlots}</span> </p>
          {BHPB}
          {MKB}
          {DSB}
          {MDB}
          {ADDG}
          {MDG}
          {isstable}
          
          <hr />
         
          </div>
    );
    }
  }
  
  
  
  
  function MakeReservationButton(props){
    return(
      <button onClick = {props.onClick} hidden={props.isShow}>
        Make Reservation
      </button>
    )
  }
  
  function Display(props){
    return(
      <button onClick = {props.onClick} hidden={props.isShow}>
        Display Current Researvation
      </button>
    )
  }
  
  function  Modify(props){
    return(
      <button onClick = {props.onClick} hidden={props.isShow}>
        Update the List 
      </button>
    )
  }
  
  
  function Back2HomepageButton(props){
    return(
      <button onClick = {props.onClick} hidden={props.isShow}>
        Back to HomePage
      </button>
    )
  }
  
  
  class AddGuest extends React.Component{
    constructor(props){
      super(props)
    }
    add(){
      const username = this.username.value.trim()
      const phone = this.userphone.value.trim()
      const phonenum = this.userphone.value.trim()

      if((username!='')&&(phone!='')){
        var today = new Date()
        const date = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate() + '  '+ today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
        const serial = this.props.count + 1
        const guestInfo = [serial, username, phone, date]
        const issue = {name:username, phone: phonenum, created: date}
        

        if(this.props.availableSlots < 1){
          alert("Sorry. We are currently full.")
        } else {
          //this.props.addGuest(guestInfo)
          this.props.handleSubmitSuccess(true)
          this.props.createIssue(issue)
        }
      }else{
        this.props.handleSubmitSuccess(false)
        alert("Required Field Misiing!")
      }
    }
    render(){
     
      return (
        <div hidden={this.props.isShow}>
            <span> Input Your Name </span>
            <input type="Name" name = 'Input your name' ref={input => this.username=input}/>
            <span> Input Your Phone </span>
            <input type="Telephone" ref={input => this.userphone=input}/>
            <button onClick={this.add.bind(this)}>Submit </button>
            <p hidden={!this.props.isSubmitSuccess} style={{backgroundColor:'green'}}>Submit success</p>
        </div>
    )
  
    }
  }
  
  class ModifyGuest extends React.Component{
    constructor(props){
        super(props)
      }
      modify(){
        // const guestlist = this.props.guestlist
        // const serial_list = []
        // for (var i=0; i<guestlist.length; i++)
        // {
        //     serial_list.push(Number(guestlist[i][0]))
        // }
  
        const serial_num = Number(this.serialnum.value.trim())
        const issue = {id:serial_num}
        this.props.deleteIssue(issue)
        // let index = serial_list.indexOf(serial_num)
        // let guestInf
        // if(index == -1){
        //     alert("No Matching Customer Reservation!")
        //     this.props.handleSubmitSuccess(false)
        // } else {
        //     guestInf = guestlist[index];
        //     this.props.deleteGuest(guestInf)
        //     this.props.handleSubmitSuccess(true)
        // }
        // this.serialnum.value = ''
  
      }
      render(){
        return (
          <div hidden={this.props.isShow}>
              <span> Input Customer Serial Num </span>
              <input type="Name" text = 'Input Customer Serial Num' ref={input => this.serialnum=input}/>
              <button onClick={this.modify.bind(this)}>Submit</button>
              <p hidden={!this.props.isSubmitSuccess} style={{backgroundColor:'green'}}>Modify success</p>
          </div>
        )
  }
  }
  
  class ShowTable extends React.Component{
    constructor(props){
      super(props)
    }
    
    render(){
      const guestlist = []
      const RenderRow = (props) =>{
        return props.keys.map((key, index)=>{
        return <td key={props.data[key]}>{props.data[key]}</td>
        })
       }
      var i = 0
      
      // const arr = this.props.issues
      // while(i<10){
      //   console.log(i);
      //   i++;
      // }
      
      // console.log(this.props.issues)
      // console.log(typeof(this.props.issues))
      // for (var i=0; i<this.props.issues.length; i++){
      //   row = this.props.issues[i]
      //   const new_list = []
      //   new_list.append(row.id)
      //   new_list.append(row.name)
      //   new_list.append(row.phone)
      //   new_list.append(row.created)
      //   guestlist.append(row)
      // }
      // console.log(guestlist)
      return (
        //using map to parse obj and convert it into a table
        <div hidden={!this.props.isShow}>
            <h2> Current Waiting Customers </h2> 
            <table>
              <thead>
                <tr>
                  <th>Serial Number</th>
                  <th>Guest Name</th>
                  <th>Phone Number</th>
                  <th>Time Stamp</th>
                </tr>
              </thead>
              <tbody>
              {
              
               
              } 
              </tbody>
            </table>
        </div>
      );
    }
 
  }
  
  
  
  const element = <HomePage />
  ReactDOM.render(element, document.getElementById('contents'));
  //ReactDOM.render(home, document.getElementById('contents'));
  
  
  
  
  
  
  