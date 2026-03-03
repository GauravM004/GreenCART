My silly doubts!!

Q.1) For states that we do statename.something or trying to go inside an json array we do name.jsonentityname what is this called?
     Understand how do we destructure an object variable or a state variable which has json?
Ans: Object Property Access(dot notation) and array default methods
             | Code             | What it is              |
             | ---------------- | ----------------------- |
             | `obj.prop`       | Object property access  |
             | `obj.prop.prop`  | Nested object access    |
             | `{ prop } = obj` | Object destructuring    |
             | `arr.length`     | Array built-in property |
             | `arr.map()`      | Array built-in method   |
             | `arr.filter()`   | Array built-in method   |
=> In React, we either access object properties using dot notation or operate on arrays using built-in
   array methods like map, filter, and length

Q.2) I really confused the concepts i used to use in office when working on my services,but when i started building my personakl project, 
     I fumbled, got confused and about to quit till then it all struck back perfectly in my mind back again.

Q.3) Focus on map function and how to use it properly with states and json arrays, because this is user everywhere in react projects. may it be for state,props,
     array stored in assests folder. Everywhere map function is used and inside it we do destructuring of json objects, so understand both concepts properly.
             
Q.3.5) {comments.map((comment, index) => ()} here we have comments and comment, index, what is this called? why we use same name for both but one
     is plural and other is singular? and OPA we do over here what is it called?
               
Q.4) When to use which approach in mapping?
     case=1: Map JSON data → JSX (inside same component)
     case-2: Map JSON data → COMPONENTS (pass data as props to child component), [we pass the id as props but inside child component we dont accept id as props,why?]

Q.5) Filter Logic Flow: 
      products (70 items)
             ↓
     filter() → check product.category
             ↓
     only matching items (say 18)
             ↓
     map() → render ProductCard for each

Q.6) In react there are functions which take arguements, my question is how do we pass arguements to those functions?
 eg: i)  const ComplianceStatusSave = async (Appkey) => {}
     ii) someFunction = () => {
           await ComplianceStatusSave(appKey);  }
     Use case 1: Function → Function
     Use case 2: JSX Event Handlers
     Use case 3: Inside map()

Q.7) <button onClick={() => somefunction()}>Something</button>
     Here in onClick we are using arrow function to call somefunction, why cant we directly use onClick={somefunction}?
     when to use which approach?

Q.8) Brush-up is required for this topics:
     | Term              | JS / React        |
     | ----------------- | ---------------   |
     | Pass by Value     | ✅ YES           |
     | Pass by Reference | ✅ YES (objects) |
     | Pass by Pointer   | ❌ NO            |


Q.9) I get confused different handlers like onsubmit, onfinish, handlesubmit, handlefinish? and events like onclick, onchange and onblur?

Q.10) I get confused on events topic, ie e.target.value, e.preventDefault(), e.stopPropagation() , in 10 months carrer I have seen them used in onClick and onChange and onSubmit events,
     and user form handling directly like onChange={(e)=> setState(e.target.value)} value={state}?? 

Q.11) And Also so, many times I have seen functions are passed inside onchange instead of how they did in above example and logic is defined in that function like 
      const handleChange = (e) => { 
      setState(e.target.value)
      } 
      <input onChange={handleChange} value={state} /> 
      So, when to use which approach? and also where did that value prop came from in input tag?

Q.12) In forms, mostly there is a "submit", "add", "save" button, so even though we have all of them why do we use   <form onSubmit={onSubmitHandler}> instead of using onClick on those buttons?

Q.13) In useState hook, when we store a many json obbjects we use "[]" bracket but when we store a single object we use "{}" curly braces, so why is it so?
      
Q.14) I know very well how useffect is used for calling an api, but it confuses me when it is used for other purposes like monitoring a state change or variable change, or filtering logic where it is updated everytime 
      or other  usecses of useeffect?

Q.15) The very Important thing to master in Frontend is the State game, how using useState you can use it as flags, for input forms, API calls data storing json, state for storing many initial values, "" string state usecase. 
     
Q.16) I need to explore more about useLocation hook, and I used it practically for the first time to hide the floating Cart icon when I reached "/cart" page route!!  
      if (itemCount === 0 || location.pathname === "/cart") return null;

Q.17) So Almost everywhere I have used Map, Filter, reduce and in pair (map,filter) is used almost everywhere, so I feel this is a very important concept in future as well of how they are filtering amnd mapping or 
      directly mapping the  data 

Q.18) What are the terminilogies called for Api Json response array, objecgt, property/proerties, key:value of property?

Q.19) The way we have a main div for each component which is correct, however there is no div for the main page where we dump all components, so why isnt there also exists
     something like a main div? 

Q.20) now that we use map for almost everything, i wanted to know do we keep the strucutre we want to continously map over stays inside the map  or outside div ??

Q.21) Dont overcomplicate GET API response API data its nothing but simple json data direct or nested properties, see the same API response which came from backend we just displayed it so bad in first attempt but now displayed
      is such a beautiful way,we just need to use map for just one main div by passing id and integrate API data as we are doing for 1 data automatically all data will come in same format,
      so just need to design one card properly and rest will be taken care by map function.
# Backend

Q.1) When TO use /services folder and when to use  MCR architecture only for writing backend logic?

#######################################
( 1 )I should feel this to be very easy and simple because I have handled 10x-20x more complexitty then this in office, so why are you getting confused on this type of 
     small small things, this is nothing what i feel that i now building as my personal projects, of what i have worked with, so i feel there are chances that i maybe a good
     softwware engineer in the next company?
( 2 )learning-1: When to use map  in component or passing props to component from main file
     learning-2: with the single + index entity we use in map, we can destructure that item either in same component 
     or passing props to component from main file
     learning-3: Learned how api gives all products data and using filter how we segregate them based on categories 
     using map + filter logic which remains same everywhere, if you study it once same concept would be used everywhere.
( 3 ) Using Tailwind libraries to import readymade components from SaaS providers is the best advantage of finishing frontend development fast, only you need to modify it as per your requirement 
      and call an API in parent and pass props in this component or call it directly in the child component and use Object Property Access of the json response using a map!!! and sometimes handle onclick, onchange or onblur , onsubmit actions on them 
      as per requirement?
( 4 ) 
1] State game
2] UseEffect Magic
3] Do bhai dono tabhai: map + filter

( 5 ) I implemented my first feature for navbar cart, it maybe small but that was my first self logiced feature, feeling good about myself!!! I feel from here this is the start of
 building features on my own and using Chatgpt as a companion and not as a complete rely.
 # For a local / UI feature (component-level)
- Locate the component where the issue/feature appears
- Find the exact element (button, input, small block)
- Identify the trigger
- user action → onClick / onChange
- automatic reaction → useEffect
- calculation → plain JS
- Add the smallest possible logic
- Test only that interaction

#For a global / shared state feature (context-level)
- Define the feature outcome
- List required global values / flags
- Decide ownership
=> global = truth
=>component = behavior
- Read needed global state in the component
- Guard edge cases at the entry point
- before action runs
- Exit early on failure
- Trigger global state update (if allowed)

( 6 ) 10Months Experience realisation: “I just need to show it beautifully on the screen using map”
- The API Data which comes in GET for products, user, address, etc remain the same a JSON Objects inside arrays, can we nested more arrays inside a JSON object or
 can even have direct properties without nesting, i just need to show it beautifully on the screen by correctly using map , there is no big fear in the name of APIs.

- APIs are just JSON.
JSON is just objects + arrays.
UI is just mapping over them.

- “API shape doesn’t matter much to frontend.
As long as data is predictable, we just transform and render it.”

- APIs can be flat, nested, deep, shallow — it doesn’t matter.
Frontend’s job is to confidently transform and present data.
You already know how to do that.

-What REALLY matters now (next level)
Not what the API looks like, but:
Are you handling missing data?
Are you handling empty arrays?
Are you handling loading states?
Are you handling partial failures?