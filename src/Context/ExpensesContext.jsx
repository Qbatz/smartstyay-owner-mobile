import React, { createContext, useState } from "react";
import {getAxios} from "../Config/AxiosConfig";

export const ExpensesContext = createContext();

export default function ExpensesProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [expensesList, setExpensesList] = useState(null)
  const [IntializeexpensesList, setIntializeExpensesList] = useState(null)
  const [rolePermission, setRolePermission] = useState(null);
   const [profileDetails, setProfileDetails] = useState(null);
   const [expenseUnits, setExpensesUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

    const getErrorMessage = (err) =>
    err?.response?.data?.message ||
    err?.response?.data ||
    err?.message ||
    "Something went wrong";

   
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
  try {
    setLoading(true);

    const axios = getAxios();
    const res = await axios.get(`/v2/expense/${hostelId}`);

    console.log("Expense API", res.data);

    if (res?.status === 200) {
      setExpensesList(res.data);
      return {
        success: true,
        data: res.data,
      };
    }

    return { success: false };
  } catch (err) {
    console.log(err);
    setExpensesList(null);
    return { success: false };
  } finally {
    setLoading(false);
  }
};

const AddExpense = async (payload,hostelId) => {
  try {
    setLoading(true);
    setError(null);
    const axios = getAxios();
    const res = await axios.post(
      `/v2/expense/${hostelId}`,
      payload
    );
   console.log("response", res.status);
   console.log("Addresponse",res)
   
    if (res?.status === 201) {
      return { success: true, data: res.data };
    }

    return { success: false, message: "Something went wrong" };
  } catch (err) {
    if (err?.response?.status === 400 || err?.response?.status === 403) {
      console.log("error", err?.response?.status , err.response.data);
      
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

const UpdateExpenseCategory = async ({
  hostelId,
  categoryId,
  newCategoryName,
}) => {
  try {
    setLoading(true);
    setError(null);

    const axios = getAxios();

    await axios.put(
      `/v2/expense/category/${hostelId}/${categoryId}`,
      { newCategoryName }
    );

    // refresh category list
    await fetchExpenses(hostelId);

    return { success: true };
  } catch (err) {
    if (err?.response?.status === 400) {
      return {
        success: false,
        message:
          err.response.data?.message || "Category name already exists",
      };
    }

    return {
      success: false,
      message: "Failed to update category",
    };
  } finally {
    setLoading(false);
  }
};

const UpdateExpenseSubCategory = async ({
  hostelId,
  subCategoryId,
  newSubCategoryName,
}) => {
  try {
    setLoading(true);
    setError(null);

    const axios = getAxios();

    await axios.put(
      `/v2/expense/subCategory/${hostelId}/${subCategoryId}`,
      { newSubCategoryName }
    );

    // refresh category list
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

    return {
      success: false,
      message: "Failed to update sub category",
    };
  } finally {
    setLoading(false);
  }
};

 const GetProfileDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const axios = getAxios();
      const res = await axios.get("/v2/profile");

      if (res?.status === 200) {
        setProfileDetails(res?.data);
        return { success: true, data: res?.data };
      }

      return { success: false };
    } catch (err) {
      setError("Failed to load profile");
      setProfileDetails(null);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };


const GetRoleBasedPermission = async (roleId) => {
  if (!roleId) {
    setRolePermission(null);
    return { success: true, empty: true };
  }

  try {
    setLoading(true);
    setError(null);

    const axios = getAxios();
    const res = await axios.get(`/v2/role/${roleId}`);

    if (res?.status === 200) {
      setRolePermission(res.data);
      return { success: true, data: res.data };
    }

    return { success: false };
  } catch (err) {
    setError("Failed to load role permission");
    setRolePermission(null);
    return { success: false };
  } finally {
    setLoading(false);
  }
};

const UpdateExpense = async (hostelId, expenseId, payload) => {
  try {
    setLoading(true);

    const axios = getAxios();

    const res = await axios.put(
      `/v2/expense/${hostelId}/${expenseId}`,
      payload
    );

    if (res.status === 200) {
      await GetExpenseList(hostelId);
      return { success: true };
    }

    return { success: false };

  } catch (err) {
    return {
      success: false,
      message: err?.response?.data || "Update failed"
    };
  } finally {
    setLoading(false);
  }
};


const DeleteExpense = async (hostelId, expenseId) => {
  try {
    setLoading(true);
    setError(null);

    const axios = getAxios();

    const res = await axios.delete(
      `/v2/expense/${hostelId}/${expenseId}`
    );

    if (res?.status === 200 || res?.status === 204) {
      // refresh expense list
      await GetExpenseList(hostelId);

      return { success: true };
    }

    return { success: false, message: "Failed to delete expense" };
  } catch (err) {
    console.log("Delete error", err?.response || err);

    return {
      success: false,
      message: err?.response?.data || "Something went wrong",
    };
  } finally {
    setLoading(false);
  }
};

 const GetExpenseUnits = async () => {
  try {
    setLoading(true);

    const axios = getAxios();
    const res = await axios.get("/v2/expense/units");

    if (res?.status === 200) {
      setExpensesUnits(res?.data || []);
      return {
        success: true,
        data: res?.data,
      };
    }

    return { success: false };
  } catch (err) {
    console.log(
      "Expense units Error:",
      err?.response?.data || err
    );

    return {
      success: false,
      message: getErrorMessage(err),
    };
  } finally {
    setLoading(false);
  }
};

const SettleExpense = async (expenseId, payload) => {
  try {
    setLoading(true);

    const axios = getAxios();

    const res = await axios.post(
      `/v2/expense/settle/${expenseId}`,
      payload
    );

    if (
      res?.status === 200 ||
      res?.status === 201
    ) {

      return {
        success: true,
        data: res?.data,
      };
    }

    return {
      success: false,
      message: "Failed to settle expense",
    };
  } catch (err) {
    console.log(
      "SETTLE EXPENSE ERROR:",
      err?.response?.data || err
    );

    return {
      success: false,
      message: getErrorMessage(err),
    };
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
        rolePermission,
        profileDetails,
        expenseUnits,
        loading,
        error,
        fetchExpenses,
        addExpenseCategory,
        addSubCategory,
        setExpenses, 
        GetExpenseList,
        AddExpense,
        GetInitializeExpense ,
        UpdateExpenseCategory,
        UpdateExpenseSubCategory,
        GetRoleBasedPermission,
        GetProfileDetails,
        UpdateExpense,
        DeleteExpense,
        GetExpenseUnits,
        SettleExpense,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}
