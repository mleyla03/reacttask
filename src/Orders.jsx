import {  Table,  Card, Modal } from "antd";

import { deleteSupplierByID, getAllSuppliers, postSupplier } from "./api/requests";
import { useEffect, useState } from "react";
import { Button, TextField } from "@mui/material";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from 'uuid';
import { Toaster, toast } from "react-hot-toast";
const { Meta } = Card;

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

function Orders() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSupplier, setNewSupplier] = useState({});
  function handleChange(e) {
    setNewSupplier({ ...newSupplier, [e.target.name]: e.target.value });
  }
  const handleOk = async() => {
    setIsModalOpen(false);
    console.log("new supplier", newSupplier);
    newSupplier.id = uuidv4();
  

    setSuppliers([...suppliers,newSupplier]);
    await postSupplier(newSupplier);
    setNewSupplier({customerId:'',contactTitle:'',postalCode:''}); 
  };

  const [basket, setBasket] = useState([]);
  //table
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
     
    },
    {
      title: "CustomerId",
      dataIndex: "customerId",
      filters: orders.map((supplier) => {
        return {
          text: supplier.customerId,
          value: supplier.customerId,
        };
      }),
      filterSearch: true,
      onFilter: (value, record) => record.customerId.includes(value),

      width: "30%",
    },
    {
      title: "freight",
      dataIndex: "freight",
      sorter: (a, b) => a.freight - b.freight,
    },

    {
      title: "orderDate",
      dataIndex: "orderDate",
      sorter: (a, b) => a.orderDate > b.orderDate,
    },
    {
      title: "requiredDate",
      dataIndex: "requiredDate",
     
    },
    {
      title: "shippedDate",
      dataIndex: "shippedDate",
    },
    {
      title: "shippedDate",
      dataIndex: ["shipAddress", "city"]

    }
  ,
     {
      title: "shippedDate",
      dataIndex: ["shipAddress", "city"]

    },
  {
      title: "Delete",
      render: (value) => (
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            Swal.fire({
              title: "Are you sure?",
              text: "You won't be able to revert this!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, delete it!",
            }).then((result) => {
              if (result.isConfirmed) {
                //delete
                deleteSupplierByID(value.id);
                let filteredSuppliers = orders.filter(
                  (item) => item.id !== value.id
                );
                setOrders(filteredSuppliers);

                //delete data from basket if exists
                let localBasket = JSON.parse(localStorage.getItem("basket"));
                let updatedBasket = localBasket.filter(
                  (basketItem) => basketItem.id !== value.id
                );
                localStorage.setItem("basket", JSON.stringify(updatedBasket));
                //update state
                let updatedBasketState = basket.filter(
                  (item) => item.id !== value.id
                );
                setBasket(updatedBasketState);
                Swal.fire("Deleted!", "Your file has been deleted.", "success");
              }
            });
          }}
        >
          Delete
        </Button>
      ),
    },
    {
      title: "Add",
      render: (value) => (
        <Button
          onClick={() => {
            const basketItem = {
              id: value.id,
              contactName: value.contactName,
              city: value.freight,
            };
            if (!localStorage.getItem("basket")) {
              localStorage.setItem("basket", JSON.stringify([basketItem]));
            } else {
              let previousBasket = JSON.parse(localStorage.getItem("basket"));
              localStorage.setItem(
                "basket",
                JSON.stringify([...previousBasket, basketItem])
              );
            }
            setBasket([...basket, basketItem]);
            //toaster
            toast.success(`${value.customerId} added to basket successfully!`);
          }}
          variant="contained"
          color="primary"
        >
          Basket
        </Button>
      ),
    },
  ];
  //get all suppliers
  useEffect(() => {
    getAllSuppliers().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, [setOrders, setLoading]);


  return (
    <>

      <span style={{display:"block",textAlign:"right"}}>
       Basket:{" "}
        <span style={{ color: "purple", fontWeight: "bold" }}>
          {basket.length}
        </span>
      </span>

   
      <Table
        style={{ width: "80%", margin: "0 auto" }}
        columns={columns}
        dataSource={orders}
        onChange={onChange}
      />
      <Modal
        title="Supplier Post Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
          <TextField
            name="customerId"
            value={newSupplier.customerId}
            onChange={(e) => handleChange(e)}
            style={{ marginRight: "10px" }}
            label="Company Name"
            variant="outlined"
          />
     
     
      </Modal>
      <div style={{display:"flex",justifyContent:"flex-end"}}>
      <Button
        onClick={() => {
          Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
          }).then((result) => {
            if (result.isConfirmed) {
              setBasket([]);
              localStorage.removeItem("basket");
              Swal.fire("Deleted!", "Your file has been deleted.", "success");
              
            }
          });
        }}
      
        variant="contained"
        color="error"

      >
        Clear Basket
      </Button>
      </div>
   
      <Toaster position="left" reverseOrder={false} />
    </>
  );
}

export default Orders;
