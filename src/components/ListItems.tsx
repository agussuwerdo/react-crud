/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-loop-func */
import React, { useEffect, useState } from "react";
import { getItems, deleteItem, updateItem, createItem } from "../services/api";
import {
  Button,
  Table,
  Form,
  Pagination,
  Spinner,
  Stack,
} from "react-bootstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { PaginatedResponse } from "../types";

const ListItems: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginatedResponse>({
    items: [],
    limit: 10,
    page: 1,
    totalCount: 0,
    totalPages: 0,
  });

  const fetchAfterAddOrDelete = (numb:number) => {
    const lastPage = Math.ceil((numb) / limit);
    if (lastPage === pagination.page) {
      fetchItems();
    } else {
      setPage(lastPage); // Redirect to the last page
    }
  }

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await getItems(page, limit);
      setPagination({
        ...data,
      });
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [page]);

  const handleAdd = async () => {
    const MySwal = withReactContent(Swal);

    let name = "";
    let price = 0;

    const { value: result } = await MySwal.fire({
      title: "Add Product",
      html: (
        <>
          <Form className="text-start">
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Product Name"
                onChange={(e) => {
                  name = e.target.value;
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Product Price"
                onChange={(e) => {
                  price = parseFloat(e.target.value);
                }}
              />
            </Form.Group>
          </Form>
        </>
      ),
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Add",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        if (!name || isNaN(price) || price <= 0) {
          Swal.showValidationMessage(
            "Please enter both name and a valid price"
          );
          return false;
        }
        try {
          await createItem({ name, price });
          fetchAfterAddOrDelete(pagination.totalCount + 1);
          return true;
        } catch (error) {
          Swal.showValidationMessage("An error occurred while adding the item");
          return false;
        }
      },
    });

    if (result) {
      await Swal.fire({
        title: "Added!",
        text: "The product has been added.",
        icon: "success",
      });
    }
  };

  const handleEdit = async (id: string) => {
    const MySwal = withReactContent(Swal);
    const item = pagination.items.find((data) => data.id === id);

    if (!item) {
      console.error("Item not found");
      return;
    }

    let name = item.name;
    let price = item.price;

    const { value: result } = await MySwal.fire({
      title: "Update Product",
      html: (
        <>
          <Form className="text-start">
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Product Name"
                defaultValue={item.name}
                onChange={(e) => {
                  name = e.target.value;
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Product Price"
                defaultValue={item.price}
                onChange={(e) => {
                  price = parseFloat(e.target.value);
                }}
              />
            </Form.Group>
          </Form>
        </>
      ),
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Update",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        if (!name || isNaN(price)) {
          Swal.showValidationMessage(
            "Please enter both name and a valid price"
          );
          return false;
        }
        try {
          await updateItem(id, { name, price });
          await fetchItems();
          return true;
        } catch (error) {
          Swal.showValidationMessage("An error occurred while updating");
          return false;
        }
      },
    });

    if (result) {
      await Swal.fire({
        title: "Updated!",
        text: "The product has been updated.",
        icon: "success",
      });
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await deleteItem(id);
          fetchAfterAddOrDelete(pagination.totalCount - 1);
          return true;
        } catch (error) {
          Swal.showValidationMessage("An error occurred while deleting");
          return false;
        }
      },
    });

    if (result.isConfirmed) {
      await Swal.fire({
        title: "Deleted!",
        text: "The product has been deleted.",
        icon: "success",
      });
    }
  };

  return (
    <div>
      <h2>Items</h2>
      <Button variant="outline-primary" className="mb-2" onClick={handleAdd}>
        Add Item
      </Button>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>*</th>
              </tr>
            </thead>
            <tbody>
              {pagination.items.map((item, index) => (
                <tr key={item.id}>
                  <td>{(page - 1) * limit + index + 1}</td>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.price}</td>
                  <td>
                    <Stack direction="horizontal" gap={2}>
                      <Button
                        onClick={() => handleEdit(item.id)}
                        variant="outline-secondary"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(item.id)}
                        variant="outline-danger"
                      >
                        Delete
                      </Button>
                    </Stack>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            <Pagination.Prev
              onClick={() => page > 1 && setPage(page - 1)}
              disabled={page === 1}
            />
            {Array.from({ length: pagination.totalPages }, (_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === page}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => page < pagination.totalPages && setPage(page + 1)}
              disabled={page === pagination.totalPages}
            />
          </Pagination>
        </>
      )}
    </div>
  );
};

export default ListItems;
