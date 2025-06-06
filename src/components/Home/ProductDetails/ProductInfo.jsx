import React from 'react'

const ProductSpecs = () => {
  return (
    <div className="mt-8">
      <h3 className="font-semibold text-lg mb-2">Specifications</h3>
      <p className="text-sm text-gray-600 mb-4">
        Inspired to create a chair where the back and arms are moulded from a single piece of plywood...
      </p>
      <table className="w-full text-sm text-left text-gray-700">
        <tbody>
          <tr><td className="py-1 font-medium">Brand:</td><td>TAKT</td></tr>
          <tr><td className="py-1 font-medium">Dimensions:</td><td>H 767 mm, D 481 mm, W 502 mm</td></tr>
          <tr><td className="py-1 font-medium">Year:</td><td>2020</td></tr>
          <tr><td className="py-1 font-medium">Seat Height:</td><td>457 mm</td></tr>
          <tr><td className="py-1 font-medium">Weight:</td><td>5 kg</td></tr>
        </tbody>
      </table>
    </div>
  )
}

export default ProductSpecs
