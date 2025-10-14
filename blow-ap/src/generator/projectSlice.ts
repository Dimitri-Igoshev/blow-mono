import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { Project } from "./ProjectProvider";
import { ENV } from "@/config/env"

export interface ProjectState {
  project: Project | null;
  loading: boolean;
}

const initialState: ProjectState = {
  project: null,
  loading: true,
};

export const fetchProject = createAsyncThunk(
  "project/fetchProject",
  async (_, { rejectWithValue }) => {
    try {
      let slug = "";

      if (localStorage.getItem("project")) {
        slug = String(localStorage.getItem("project"));
      } else {
        slug = new URLSearchParams(window.location.search).get("project") || "";
        localStorage.setItem("project", slug);
      }

      // const res = await api.get<Project>(`/projects/slug/${slug}`);
      return {
        // _id: "687059ff52b5bebf3df39225",
        name: "Blow",
        slug: "blow",
        // apiUrl: "https://api.blow.ru/api",
        apiUrl: ENV.API_URL,
        config: {
          themeColors: {
            primary: "#E31E24",
            secondary: "#2B2A29",
          },
          bgUrl: `${ENV.MEDIA_URL}/core/bg-blow.png`,
          logoUrl: `${ENV.MEDIA_URL}/core/BLOW%201.png`,
          logoBigUrl: `${ENV.MEDIA_URL}/core/BLOW%202.png`,
          faviconUrl: `${ENV.MEDIA_URL}/core/favicon.ico`,
        },
        // owner: "68704800696a9aa45ce211a9",
        // members: [
        //     "68704800696a9aa45ce211a9"
        // ],
        // status: "active",
        // createdAt: "2025-07-11T00:25:35.421Z",
        // updatedAt: "2025-07-11T00:25:35.421Z",
        // __v: 0,
        description: "Поиск лучших содержанок и самых успешных мужчин",
        // apiMediaUrl: "https://api.blow.ru",
        apiMediaUrl: ENV.MEDIA_URL,
        token: {
          email: "dimi.igoshev@gmail.com",
          password: "mungic-gysky9-Basjap",
        },
      };
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProject.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProject.fulfilled, (state, action) => {
      state.project = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchProject.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default projectSlice.reducer;
