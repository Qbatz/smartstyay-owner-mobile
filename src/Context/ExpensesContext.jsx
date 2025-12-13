import React, { createContext, useState } from "react";
import AxiosConfig from "../Config/AxiosConfig";

export const ExpensesContext = createContext();

export default function ExpensesProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ---------------- GET ---------------- */
  const fetchExpenses = async (hostelId) => {
    if (!hostelId) {
      setExpenses([]);
      return { success: true, empty: true };
    }

    try {
      setLoading(true);
      setError(null);

      const res = await AxiosConfig.get(
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

  /* ---------------- ADD CATEGORY ---------------- */
  const addExpenseCategory = async ({ hostelId, categoryName }) => {
    try {
      setLoading(true);
      setError(null);

      await AxiosConfig.post(
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

  /* ---------------- ADD SUB CATEGORY ---------------- */
  const addSubCategory = async ({
    hostelId,
    categoryId,
    subCategory,
  }) => {
    try {
      setLoading(true);
      setError(null);

      await AxiosConfig.post(
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

  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        loading,
        error,
        fetchExpenses,
        addExpenseCategory,
        addSubCategory,
        setExpenses, // local edits
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}
