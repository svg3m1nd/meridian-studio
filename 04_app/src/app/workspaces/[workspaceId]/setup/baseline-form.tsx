"use client";

import {useActionState} from "react";
import {type BaselineFormState,updateBaselineAction} from "@/app/actions/workspaces";

export type BaselineFormValues={
 workspaceId:string;
 canonicalName:string;
 websiteUrl:string;
 aliases:string[];
 locale:string;
 market:string;
 competitors:string[];
 topics:string[];
 queries:string[];
};

const initialState:BaselineFormState={status:"idle",message:"",fieldErrors:{}};

export function BaselineForm({values}:{values:BaselineFormValues}){
 const [state,formAction,pending]=useActionState(updateBaselineAction,initialState);
 const error=(name:string)=>state.fieldErrors[name]?.[0];
 const describedBy=(name:string,help?:string)=>[help,error(name)?`${name}-error`:null].filter(Boolean).join(" ")||undefined;
 const fieldError=(name:string)=>error(name)?<span className="field-error" id={`${name}-error`}>{error(name)}</span>:null;
 return <form action={formAction} className="form">
  <input type="hidden" name="workspaceId" value={values.workspaceId}/>
  {state.status!=="idle"&&<p className={`notice ${state.status}`} role={state.status==="error"?"alert":"status"}>{state.message}</p>}
  <label htmlFor="canonicalName">Canonical business name<input id="canonicalName" name="canonicalName" required defaultValue={values.canonicalName} aria-invalid={Boolean(error("canonicalName"))} aria-describedby={describedBy("canonicalName")}/>{fieldError("canonicalName")}</label>
  <label htmlFor="websiteUrl">Website URL<input id="websiteUrl" name="websiteUrl" type="url" defaultValue={values.websiteUrl} aria-invalid={Boolean(error("websiteUrl"))} aria-describedby={describedBy("websiteUrl")}/>{fieldError("websiteUrl")}</label>
  <label htmlFor="aliases">Aliases, one per line<textarea id="aliases" name="aliases" defaultValue={values.aliases.join("\n")} aria-invalid={Boolean(error("aliases"))} aria-describedby={describedBy("aliases")}/>{fieldError("aliases")}</label>
  <div className="fields">
   <label htmlFor="locale">Locale<input id="locale" name="locale" required defaultValue={values.locale} aria-invalid={Boolean(error("locale"))} aria-describedby={describedBy("locale")}/>{fieldError("locale")}</label>
   <label htmlFor="market">Market<input id="market" name="market" defaultValue={values.market} aria-invalid={Boolean(error("market"))} aria-describedby={describedBy("market")}/>{fieldError("market")}</label>
  </div>
  <label htmlFor="competitors">Competitors, one per line<textarea id="competitors" name="competitors" defaultValue={values.competitors.join("\n")} aria-invalid={Boolean(error("competitors"))} aria-describedby={describedBy("competitors")}/>{fieldError("competitors")}</label>
  <label htmlFor="topics">Topics, one per line<textarea id="topics" name="topics" defaultValue={values.topics.join("\n")} aria-invalid={Boolean(error("topics"))} aria-describedby={describedBy("topics")}/>{fieldError("topics")}</label>
  <label htmlFor="queries">Target searches and AI prompts, one per line<span className="field-help" id="query-help">Concrete questions Meridian should test across search engines and AI systems.</span><textarea id="queries" name="queries" placeholder={'best digital marketing agency for small businesses\nwho offers SEO strategy in Denver'} defaultValue={values.queries.join("\n")} aria-invalid={Boolean(error("queries"))} aria-describedby={describedBy("queries","query-help")}/>{fieldError("queries")}</label>
  <button type="submit" disabled={pending}>{pending?"Saving…":"Save baseline"}</button>
 </form>;
}
