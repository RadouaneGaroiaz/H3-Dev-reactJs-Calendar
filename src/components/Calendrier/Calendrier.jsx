import axios from 'axios';
import moment from 'moment/moment';
import 'animate.css';
import React, { useEffect, useState } from 'react'
import { Form, Table , Button } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup';
import "./Calendrier.css";

const API_URL = "http://localhost:3003/listAppointments";
const firstDay = new Date("December 31, 1999");
const lastDay = new Date("December 31, 2100");

export default function Calendrier() {


    const [years, setYears] = useState();
    const [month, setMonth] = useState();
    const [day, setDay] = useState();

    const [calendar, setCalendar] = useState([]);

    const [currentMonth , setCurrentMonth] = useState([]); 
    const [selectedDay, setSelectedDay] = useState();


    const [Appointment , setAppointment] = useState({
        title : "",
        comment :"",
    });

    const [allAppointment, setAllAppointment] = useState([]);
    const [AppointmentOfDay, SetAppointmentOfDay] = useState([]);

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    


    const monthName = moment.months();

    const dayName = moment.weekdays();



    const onChange= (e) =>{
        const {name , value}= e.target ;
        setAppointment(prevForm =>{ 
            return  {...prevForm , [name]: value} 
        })
    }
 


    const [show, setShow] = useState(false);
    const [showRes, setShowRes] = useState(false);

    const handleClose = () => setShow(false);



    const handleCloseRes = () => setShowRes(false);
    const handleShowRes = () => setShowRes(true);


    const prevMonth = () => {
        console.log(month-1); 
        if(month-1 === 0){
            setMonth(12);
            setYears(years-1);
        }   
        else setMonth(month-1);
    }
    const nextMonth = () => {
        console.log(month+1); 
        if(month+1 === 13){
            setMonth(1);
            setYears(years+1);
        }
        else setMonth(month+1);
    }
    const nextYear = () => {
        console.log(years+1);
        setYears(years+1);
    }
    const prevYear = () => {
        console.log(years-1); 
        setYears(years-1);
    }
    const dayClick = (a) => {
        console.log(a);
        setSelectedDay(a.toLocaleDateString("en-US",options));
    }

    const appoDayClick = () => {
        
        setShow(true);
        
    }

    const appoDelete = (e, Appointment) => {
        e.preventDefault();
        axios.delete(API_URL + `/${Appointment.id}`).then(res=> console.log(res));
    }
    const takeAppo = (e) =>{
        e.preventDefault();

            console.log(selectedDay);
            console.log(Appointment);
            let obj = {
                title : Appointment.title,
                comment : Appointment.comment,
                date : selectedDay
            }
            axios.post(API_URL, obj).then(res => console.log(res)); 
      
    }



    useEffect(() => {
        const result = calendar.filter(c => (c.getMonth()) === (month-1) && c.getFullYear() === years);
        setCurrentMonth(result);
        setSelectedDay();
    }, [years,day,month]);


    // get
    useEffect(() => {
        axios.get(API_URL+`?date=${selectedDay}`).then(res => SetAppointmentOfDay(res.data));
    }, [selectedDay]);


    // remplire calendrier
    useEffect(() => {
        setAllAppointment([]);
        const date = new Date();
        setMonth(date.getMonth()+1);
        setYears(date.getFullYear());
        setDay(date.getDate());
        var r = [];
        while (firstDay <= lastDay)
        {
            r.push(new Date(firstDay.setDate(firstDay.getDate() + 1)));
        }
        setCalendar(r);
        SetAppointmentOfDay([]);
        axios.get(API_URL).then(res => setAllAppointment(res.data));
    }, []);



    return (
        <div className="container">
           
            <div className='row text-center mt-5'>
                <div className="col-md-12">
                <h2 className='animate__animated animate__bounce'>{new Date().toLocaleDateString("en-US",options)}</h2>
                <br />

                    <div className="row text-center">
                        <div className="d-flex justify-content-center">
                            <button className='btn btn-outline-secondary prev' onClick={()=> prevMonth()}> <Icon.ArrowLeftSquare/> </button>    
                            <b className='mt-2'>{monthName[month-1]}</b>
                            <button className='btn btn-outline-secondary next' onClick={() => nextMonth()}> <Icon.ArrowRightSquare/> </button>    
                        </div>
                        <div className="mt-2 d-flex justify-content-center">
                            <button className='btn btn-outline-secondary prev' onClick={() => prevYear()}> <Icon.ArrowLeftSquare/> </button>    
                            <b className='mt-2'>{years}</b>
                            <button className='btn btn-outline-secondary next' onClick={() => nextYear()}> <Icon.ArrowRightSquare/> </button>    
                        </div>
                    </div>

                    <br />
                    <Table bordered>
                        <thead>
                            <tr>
                                {currentMonth.length > 0 && currentMonth.slice(0,7).map(a => {
                             
                                    return <th scope="col">{dayName[a.getDay()]}</th>
                                })}
                            </tr>
                        </thead>
                        <tbody className='body-table'>
                                
                                <tr> 

                                {currentMonth.length > 0 && currentMonth.slice(0,7).map(a => {
                                    const Appointments = allAppointment.filter(Appointment => Appointment.date === a.toLocaleDateString("en-US",options));
                                    //mettre la case du jour en noire
                                    if(new Date().toLocaleDateString("en-US",options) === a.toLocaleDateString("en-US",options)){
                                        return <td className='col-md-1 item-tab' 
                                                    key={a} 
                                                    style={{backgroundColor:'black',color:'white'}}
                                                    onClick={()=> {
                                                    dayClick(a);
                                                    
                                                }}>
                                                    {a.getDate()}
                                                 </td>
                                    }

                                    //griser la case des Appointment déja prise
                                    if(Appointments.length>0){
                                        return <td className='col-md-1 item-tab border border-dark' 
                                                    key={a} 
                                                    style={{backgroundColor:'grey'}}
                                                    onClick={()=> {
                                                    dayClick(a);
                                                    
                                                }}>
                                                    {a.getDate()}
                                                 </td>
                                    }else{
                                        return <td className='col-md-1 item-tab border border border-dark' key={a} onClick={()=> {
                                            dayClick(a);
                                            appoDayClick();
                                          
                                        }}>{a.getDate()}</td>
                                    }
                                })}
                                </tr>
                                <tr> 
                                 {currentMonth.length > 0 && currentMonth.slice(7,14).map(a => {
                                    const Appointments = allAppointment.filter(Appointment => Appointment.date === a.toLocaleDateString("en-US",options));
                                    if(new Date().toLocaleDateString("en-US",options) === a.toLocaleDateString("en-US",options)){
                                        return <td className='col-md-1 item-tab' 
                                                    key={a} 
                                                    style={{backgroundColor:'black',color:'white'}}
                                                    onClick={()=> {
                                                    dayClick(a);
                                                    
                                                }}>
                                                    {a.getDate()}
                                                 </td>
                                    }
                                    if(Appointments.length>0){
                                        return <td className='col-md-1 item-tab border border-dark' 
                                                    key={a} 
                                                    style={{backgroundColor:'grey'}}
                                                    onClick={()=> {
                                                    dayClick(a);
                                                    
                                                }}>
                                                    {a.getDate()}
                                                 </td>
                                    }else{
                                        return <td className='col-md-1 item-tab border border border-dark' key={a} onClick={()=> {
                                            dayClick(a);
                                            appoDayClick();
                                           
                                        }}>{a.getDate()}</td>
                                    }
                                })}
                                </tr>
                                <tr> 
                                {currentMonth.length > 0 && currentMonth.slice(14,21).map(a => {
                                    const Appointments = allAppointment.filter(Appointment => Appointment.date === a.toLocaleDateString("en-US",options));
                                    if(new Date().toLocaleDateString("en-US",options) === a.toLocaleDateString("en-US",options)){
                                        return <td className='col-md-1 item-tab' 
                                                    key={a} 
                                                    style={{backgroundColor:'black',color:'white'}}
                                                    onClick={()=> {
                                                    dayClick(a);
                                                    
                                                }}>
                                                    {a.getDate()}
                                                 </td>
                                    }
                                    if(Appointments.length>0){
                                        return <td className='col-md-1 item-tab border border-dark' 
                                                    key={a} 
                                                    style={{backgroundColor:'grey'}}
                                                    onClick={()=> {
                                                    dayClick(a);
                                                    
                                                }}>
                                                    {a.getDate()}
                                                 </td>
                                    }else{
                                        return <td className='col-md-1 item-tab border border-dark' key={a} onClick={()=> {
                                            dayClick(a);
                                            appoDayClick();
                                           
                                        }}>{a.getDate()}</td>
                                    }
                                    
                                })}
                                </tr>
                                <tr> 
                                {currentMonth.length > 0 && currentMonth.slice(21,28).map(a => {
                                    const Appointments = allAppointment.filter(Appointment => Appointment.date === a.toLocaleDateString("en-US",options));
                                    if(new Date().toLocaleDateString("en-US",options) === a.toLocaleDateString("en-US",options)){
                                        return <td className='col-md-1 item-tab' 
                                                    key={a} 
                                                    style={{backgroundColor:'black',color:'white'}}
                                                    onClick={()=> {
                                                    dayClick(a);
                                                    
                                                }}>
                                                    {a.getDate()}
                                                 </td>
                                    }
                                    if(Appointments.length>0){
                                        
                                        return <td className='col-md-1 item-tab border border-dark' 
                                                    key={a} 
                                                    style={{backgroundColor:'grey'}}
                                                    onClick={()=> {
                                                    dayClick(a);
                                                    
                                                }}>
                                                    {a.getDate()}
                                                 </td>
                                    }else{
                                        return <td className='col-md-1 item-tab border border-dark' key={a} onClick={()=> {
                                            dayClick(a);
                                            appoDayClick();
                                           
                                        }}>{a.getDate()}</td>
                                    }
                                })}
                                </tr>
                                <tr> 
                                {currentMonth.length > 0 && currentMonth.slice(28,31).map(a => {
                                    const Appointments = allAppointment.filter(Appointment => Appointment.date === a.toLocaleDateString("en-US",options));
                                    if(Appointments.length>0){
                                        
                                        return <td className='col-md-1 item-tab' 
                                                    key={a} 
                                                    style={{backgroundColor:'grey'}}
                                                    onClick={()=> {
                                                    dayClick(a);
                                                    
                                                }}>
                                                    {a.getDate()}
                                                 </td>
                                    }else{
                                        return <td className='col-md-1 item-tab border border-dark' key={a} onClick={()=> {
                                            dayClick(a);
                                            appoDayClick();
                                           
                                        }}>{a.getDate()}</td>
                                    }
                                    
                                })} 
                                </tr>
                        </tbody>
                    </Table>
                </div>

                <div className='col-md-6'>

                <>
     {/*  <Button variant="primary" onClick={handleShow}>
        Take Appointment
      </Button> */}

    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Make an appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form.Group className="mb-3" controlId="form_title">
        <InputGroup hasValidation>
                            <Form.Control required className='text-center' type="text" placeholder="Enter the title of the appointment" name="title" onChange={onChange} />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid state.
                            </Form.Control.Feedback>
        </InputGroup>
                        </Form.Group>
                        <Form.Group controlId="form_comment">
        <InputGroup hasValidation>
                        <Form.Control 
                                required
                                type="textarea" 
                                name="comment"
                                placeholder="Message"
                                style={{width:'30em'}}
                                onChange={onChange}
                                className='text-center'
                                
                        />
                        <Form.Control.Feedback type="invalid">
                                Please provide a valid state.
                            </Form.Control.Feedback>
        </InputGroup>
                        </Form.Group>

        <Form.Group className="mb-3 mt-3" controlId="form_date">
                            <Form.Control className="text-center" type="text" placeholder="Choose your date" name="date" disabled={true} value={selectedDay} required/>
                        </Form.Group>
                       

        </Modal.Body>
        <Modal.Footer>
          <Button variant = "secondary" onClick = {handleClose}>
            Close
          </Button>
          <Button variant = "success" type = "submit" onClick = {(e) => takeAppo(e)}>
                            Confirm Appointment
                        </Button>
        </Modal.Footer>
      </Modal>
        </>
                   
                </div>
            </div>

            <div className="row text-center mt-5">
                {AppointmentOfDay.length>0 && 
                    AppointmentOfDay.map(Appointment => {
                        return (
                            <>
                            <div>
                            <Button className='animate__animated animate__backInDown' variant="primary" onClick={handleShowRes}>
                                Show Appointment
                              </Button>
                            </div>
                             
                        
                              <Modal show={showRes} onHide={handleCloseRes}>
                                <Modal.Header closeButton>
                                  <Modal.Title>Appointment Details</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                        <Form.Group className="mb-3" controlId="form_title">
                            <Form.Control className="text-center" type="text" placeholder="Enter the title of the appointment" name="title" value={Appointment.title} onChange={onChange}/>
                        </Form.Group>
                        <Form.Control type="textarea" 
                                name="comment"
                                placeholder="Message"
                                style={{width:'30em'}}
                                onChange={onChange}
                                className='text-center'
                                value={Appointment.comment}
                        />

                        <Form.Group className="mb-3 mt-3" controlId="form_date">
                            <Form.Control className="text-center" type="text" placeholder="Choose your date" name="date" disabled={true} value={Appointment.date}/>
                        </Form.Group>
                                </Modal.Body>
                                <Modal.Footer>
                                  <Button variant="secondary" onClick={handleCloseRes}>
                                    Close
                                  </Button>
                                  <Button variant="danger" onClick={(e)=> appoDelete(e,Appointment)}>
                                    Delete Appointment
                                  </Button>
                                </Modal.Footer>
                              </Modal>
                            </>
                          );
                    })
                }
            </div>
    </div>
  )
}
