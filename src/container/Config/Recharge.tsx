import React from "react"

const Recharge: React.FC = () => {
  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto">
      <div className="flex flex-col items-center h-full">
        <div className="card bg-base-100 w-96 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Card title!</h2>
            <p>If a dog chews shoes whose shoes does he choose?</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Recharge
