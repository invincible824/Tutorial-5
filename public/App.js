const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  //if (dateRegex.test(value)) return new Date(value);
  return value;
}

async function graphQLFetch(query, variables = {}) {
  //console.log('graphQL')
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables
      })
    });
    const body = await response.text(); //const result = body

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
  return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, issue.id), /*#__PURE__*/React.createElement("td", null, issue.name), /*#__PURE__*/React.createElement("td", null, issue.phone), /*#__PURE__*/React.createElement("td", null, issue.created));
}

function IssueTable(props) {
  const issueRows = props.issues.map(issue => /*#__PURE__*/React.createElement(IssueRow, {
    key: issue.id,
    issue: issue
  })); //.log('test')
  //console.log(props.issues)

  return /*#__PURE__*/React.createElement("table", {
    className: "bordered-table",
    hidden: props.isShow
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "ID"), /*#__PURE__*/React.createElement("th", null, "NAME"), /*#__PURE__*/React.createElement("th", null, "PHONE"), /*#__PURE__*/React.createElement("th", null, "Created"))), /*#__PURE__*/React.createElement("tbody", null, issueRows));
}

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.handleMKBClick = this.handleMKBClick.bind(this);
    this.handleBack2Homepage = this.handleBack2Homepage.bind(this);
    this.handleDisplay = this.handleDisplay.bind(this);
    this.handleModify = this.handleModify.bind(this);
    this.handleSubmitSuccess = this.handleSubmitSuccess.bind(this);
    this.createIssue = this.createIssue.bind(this);
    this.deleteIssue = this.deleteIssue.bind(this);
    this.state = {
      issues: [],
      guestlist: [],
      count: 0,
      isAtHome: true,
      isAtResearvation: false,
      isAtDisplay: false,
      isAtModify: false,
      availableSlots: 25,
      isSubmitSuccess: false
    };
  }

  componentDidMount() {
    //console.log('ComponentDid')
    this.loadData();
  }

  addGuest = guestInfo => {
    const copyGuestlist = this.state.guestlist;
    copyGuestlist.push(guestInfo);
    this.setState({
      guestlist: copyGuestlist
    });
    var copycount = this.state.count;
    copycount = copycount + 1;
    this.setState({
      count: copycount
    });
    var copyavailableSlots = this.state.availableSlots;
    copyavailableSlots = copyavailableSlots - 1;
    this.setState({
      availableSlots: copyavailableSlots
    });
  };
  deleteGuest = guestInfo => {
    const copyGuestlist = this.state.guestlist;
    const newGuestlist = [];

    for (var i = 0; i < copyGuestlist.length; i++) {
      if (copyGuestlist[i] != guestInfo) {
        newGuestlist.push(copyGuestlist[i]);
      }
    }

    this.setState({
      guestlist: newGuestlist
    });
    var copyavailableSlots = this.state.availableSlots;
    copyavailableSlots = copyavailableSlots + 1;
    this.setState({
      availableSlots: copyavailableSlots
    });
  };

  handleMKBClick() {
    this.setState({
      isAtHome: false
    });
    this.setState({
      isAtResearvation: true
    });
  }

  handleDisplay() {
    this.setState({
      isAtHome: false
    });
    this.setState({
      isAtDisplay: true
    });
  }

  handleModify() {
    this.setState({
      isAtHome: false
    });
    this.setState({
      isAtModify: true
    });
  }

  handleBack2Homepage() {
    this.setState({
      isAtHome: true
    });
    this.setState({
      isAtResearvation: false
    });
    this.setState({
      isAtDisplay: false
    });
    this.setState({
      isAtModify: false
    });
    this.setState({
      isSubmitSuccess: false
    });
  }

  handleSubmitSuccess(is_success) {
    if (is_success) {
      this.setState({
        isSubmitSuccess: true
      });
    } else {
      this.setState({
        isSubmitSuccess: false
      });
    }
  } //loaddata


  async loadData() {
    //console.log('load_data')
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
      this.setState({
        issues: data.issueList,
        availableSlots: 25 - data.issueList.length
      });
    }
  } //write in data


  async createIssue(issue) {
    //console.log('createissue')
    const query = `mutation issueAdd($issue: IssueInputs!) {
        issueAdd(issue: $issue) {
          id
        }
      }`;
    const data = await graphQLFetch(query, {
      issue
    });

    if (data) {
      this.loadData();
    }
  } //delete data


  async deleteIssue(issue) {
    //console.log('deleteissue')
    const query = `mutation issueDelete($issue: IssueDelInputs!) {
        issueDelete(issue: $issue) {
          id
        }
      }`;
    const data = await graphQLFetch(query, {
      issue
    });

    if (data) {
      this.loadData();
    }
  }

  render() {
    const guestlist_cs = this.state.guestlist;
    let MKB, DSB, MDB;
    const isstable = /*#__PURE__*/React.createElement(IssueTable, {
      issues: this.state.issues,
      isShow: !this.state.isAtDisplay
    });
    MKB = /*#__PURE__*/React.createElement(MakeReservationButton, {
      onClick: this.handleMKBClick,
      isShow: !this.state.isAtHome
    });
    DSB = /*#__PURE__*/React.createElement(Display, {
      onClick: this.handleDisplay,
      isShow: !this.state.isAtHome
    });
    MDB = /*#__PURE__*/React.createElement(Modify, {
      onClick: this.handleModify,
      isShow: !this.state.isAtHome
    });
    const BHPB = /*#__PURE__*/React.createElement(Back2HomepageButton, {
      onClick: this.handleBack2Homepage,
      isShow: this.state.isAtHome
    });
    const ADDG = /*#__PURE__*/React.createElement(AddGuest, {
      count: this.state.count,
      createIssue: this.createIssue,
      addGuest: this.addGuest,
      guestlist: this.state.guestlist,
      availableSlots: this.state.availableSlots,
      isSubmitSuccess: this.state.isSubmitSuccess,
      handleSubmitSuccess: this.handleSubmitSuccess,
      isShow: !this.state.isAtResearvation
    });
    const MDG = /*#__PURE__*/React.createElement(ModifyGuest, {
      guestlist: this.state.guestlist,
      deleteIssue: this.deleteIssue,
      deleteGuest: (this, this.deleteGuest),
      isSubmitSuccess: this.state.isSubmitSuccess,
      handleSubmitSuccess: this.handleSubmitSuccess,
      isShow: !this.state.isAtModify
    });
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", null, " Restaurant Waitlist System "), /*#__PURE__*/React.createElement("p", null, " Available Slots: ", /*#__PURE__*/React.createElement("span", null, this.state.availableSlots), " "), BHPB, MKB, DSB, MDB, ADDG, MDG, isstable, /*#__PURE__*/React.createElement("hr", null));
  }

}

function MakeReservationButton(props) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: props.onClick,
    hidden: props.isShow
  }, "Make Reservation");
}

function Display(props) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: props.onClick,
    hidden: props.isShow
  }, "Display Current Researvation");
}

function Modify(props) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: props.onClick,
    hidden: props.isShow
  }, "Update the List");
}

function Back2HomepageButton(props) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: props.onClick,
    hidden: props.isShow
  }, "Back to HomePage");
}

class AddGuest extends React.Component {
  constructor(props) {
    super(props);
  }

  add() {
    const username = this.username.value.trim();
    const phone = this.userphone.value.trim();
    const phonenum = this.userphone.value.trim();

    if (username != '' && phone != '') {
      var today = new Date();
      const date = today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate() + '  ' + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
      const serial = this.props.count + 1;
      const guestInfo = [serial, username, phone, date];
      const issue = {
        name: username,
        phone: phonenum,
        created: date
      };

      if (this.props.availableSlots < 1) {
        alert("Sorry. We are currently full.");
      } else {
        //this.props.addGuest(guestInfo)
        this.props.handleSubmitSuccess(true);
        this.props.createIssue(issue);
      }
    } else {
      this.props.handleSubmitSuccess(false);
      alert("Required Field Misiing!");
    }
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      hidden: this.props.isShow
    }, /*#__PURE__*/React.createElement("span", null, " Input Your Name "), /*#__PURE__*/React.createElement("input", {
      type: "Name",
      name: "Input your name",
      ref: input => this.username = input
    }), /*#__PURE__*/React.createElement("span", null, " Input Your Phone "), /*#__PURE__*/React.createElement("input", {
      type: "Telephone",
      ref: input => this.userphone = input
    }), /*#__PURE__*/React.createElement("button", {
      onClick: this.add.bind(this)
    }, "Submit "), /*#__PURE__*/React.createElement("p", {
      hidden: !this.props.isSubmitSuccess,
      style: {
        backgroundColor: 'green'
      }
    }, "Submit success"));
  }

}

class ModifyGuest extends React.Component {
  constructor(props) {
    super(props);
  }

  modify() {
    const serial_num = Number(this.serialnum.value.trim());
    const issue = {
      id: serial_num
    };
    this.props.deleteIssue(issue);
  }

  render() {
    return /*#__PURE__*/React.createElement("div", {
      hidden: this.props.isShow
    }, /*#__PURE__*/React.createElement("span", null, " Input Customer Serial Num "), /*#__PURE__*/React.createElement("input", {
      type: "Name",
      text: "Input Customer Serial Num",
      ref: input => this.serialnum = input
    }), /*#__PURE__*/React.createElement("button", {
      onClick: this.modify.bind(this)
    }, "Submit"), /*#__PURE__*/React.createElement("p", {
      hidden: !this.props.isSubmitSuccess,
      style: {
        backgroundColor: 'green'
      }
    }, "Modify success"));
  }

}

class ShowTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const guestlist = [];

    const RenderRow = props => {
      return props.keys.map((key, index) => {
        return /*#__PURE__*/React.createElement("td", {
          key: props.data[key]
        }, props.data[key]);
      });
    };

    var i = 0;
    return (
      /*#__PURE__*/
      //using map to parse obj and convert it into a table
      React.createElement("div", {
        hidden: !this.props.isShow
      }, /*#__PURE__*/React.createElement("h2", null, " Current Waiting Customers "), /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Serial Number"), /*#__PURE__*/React.createElement("th", null, "Guest Name"), /*#__PURE__*/React.createElement("th", null, "Phone Number"), /*#__PURE__*/React.createElement("th", null, "Time Stamp"))), /*#__PURE__*/React.createElement("tbody", null)))
    );
  }

}

const element = /*#__PURE__*/React.createElement(HomePage, null);
ReactDOM.render(element, document.getElementById('contents'));
