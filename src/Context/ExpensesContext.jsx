import React, { createContext, useState } from "react";
import AxiosConfig, {getAxios} from "../Config/AxiosConfig";

export const ExpensesContext = createContext();

export default function ExpensesProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [expensesList, setExpensesList] = useState([])
  const [IntializeexpensesList, setIntializeExpensesList] = useState(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

   
  const fetchExpenses = async (hostelId) => {
    if (!hostelId) {
      setExpenses([]);
      return { success: true, empty: true };
    }

    try {
      setLoading(true);
      setError(null);
      const axios = getAxios();
      const res = await axios.get(
        `/v2/expense/category/${hostelId}`
      );

      const data = Array.isArray(res.data) ? res.data : [];

      if (data.length === 0) {
        setExpenses([]);
        return { success: true, empty: true };
      }

      const formatted = data.map((cat) => ({
        id: String(cat.categoryId),
        title: cat.categoryName,
        subcategories: (cat.listSubcategories || []).map((sub) => ({
          id: String(sub.subCategoryId),
          name: sub.subCategoryName,
        })),
      }));

      setExpenses(formatted);
      return { success: true };
    } catch (err) {
      setError("Failed to load expenses");
      setExpenses([]);
      return { success: false };
    } finally {
        setTimeout(() => {
             setLoading(false);
        }, 1000);
     
    }
  };

  const addExpenseCategory = async ({ hostelId, categoryName }) => {
    try {
      setLoading(true);
      setError(null);

      const axios = getAxios();
      await axios.post(
        `/v2/expense/category/${hostelId}`,
        { hostelId, categoryName }
      );

      // refresh list
      await fetchExpenses(hostelId);
      return { success: true };
    } catch (err) {
      if (err?.response?.status === 400) {
        return {
          success: false,
          message: err.response.data?.message || "Category already exists",
        };
      }
      return { success: false, message: "Something went wrong" };
    } finally {
      setLoading(false);
    }
  };

  const addSubCategory = async ({
    hostelId,
    categoryId,
    subCategory,
  }) => {
    try {
      setLoading(true);
      setError(null);
      const axios = getAxios();
      await axios.post(
        `/v2/expense/category/${hostelId}`,
        { hostelId, categoryId, subCategory }
      );

      await fetchExpenses(hostelId);
      return { success: true };
    } catch (err) {
      if (err?.response?.status === 400) {
        return {
          success: false,
          message:
            err.response.data?.message || "Sub category already exists",
        };
      }
      return { success: false, message: "Something went wrong" };
    } finally {
      setLoading(false);
    }
  };

const GetExpenseList = async (hostelId) => {
  if (!hostelId) {
    setExpensesList([]);
    return { success: true, empty: true };
  }

  try {
    setLoading(true);
    setError(null);
    const axios = getAxios();
    const res = await axios.get(`/v2/expense/${hostelId}`);

    const data = Array.isArray(res?.data) ? res?.data : [];

    if (data.length === 0) {
      setExpensesList([]);
      return { success: true, empty: true };
    }

    setExpensesList(data);
    return { success: true };
  } catch (err) {
    setError("Failed to load expenses");
    setExpensesList([]);
    return { success: false };
  } finally {
    setLoading(false);
  }
};

const AddExpense = async (payload) => {
  try {
    setLoading(true);
    setError(null);
    const axios = getAxios();
    const res = await axios.post(
      `/v2/expense/${payload.hostelId}`,
      payload
    );

    if (res?.status === 201) {
      return { success: true, data: res.data };
    }

    return { success: false, message: "Something went wrong" };
  } catch (err) {
    if (err?.response?.status === 400 || err?.response?.status === 403) {
      return {
        success: false,
        message: err.response.data || "Insufficient fund",
      };
    }
    return { success: false, message: "Network error" };
  } finally {
    setLoading(false);
  }
}

const GetInitializeExpense = async (hostelId) => {
  if (!hostelId) {
    setIntializeExpensesList(null);
    return { success: true, empty: true };
  }

  try {
    setLoading(true);
    setError(null);
    const axios = getAxios();
    const res = await axios.get(
      `/v2/expense/initialize/${hostelId}`
    );

    if (res?.status === 200) {
      setIntializeExpensesList(res?.data);

      return { success: true };
    }

    return { success: false };
  } catch (err) {
    setError("Failed to load expenses");
    setIntializeExpensesList(null);
    return { success: false };
  } finally {
    setLoading(false);
  }
};



  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        expensesList,
        IntializeexpensesList,
        loading,
        error,
        fetchExpenses,
        addExpenseCategory,
        addSubCategory,
        setExpenses, 
        GetExpenseList,
        AddExpense,
        GetInitializeExpense
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}
