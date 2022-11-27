import React from 'react'
import { Button, Form } from 'react-bootstrap'
import store from '../store'
import "./Modal.css"
function Modal({closeModal,joinBtnHandler}) {
  return (
  
<div className="bulkEdit__modal" data-test="bulk-edit-modal" >
        <div className="bulkEdit__modal__content">
        <button className="close" onClick={()=>closeModal(false)}>X</button>
        <div className="title">
          <h2>Ce notă îți propui să obții la această materie?</h2>
        </div>
        
        
        <Form onSubmit={joinBtnHandler}>
            <Form.Group controlId="courseGrade">
              <Form.Control type="text" name="courseGrade" required placeholder='Nota dorita' />

            </Form.Group>
            <Form.Group >
              <Button variant='primary' type='submit'>Submit</Button>
            </Form.Group>

        </Form>
        <div className="body">
        </div>
        </div>
</div>
  )
}

export default Modal